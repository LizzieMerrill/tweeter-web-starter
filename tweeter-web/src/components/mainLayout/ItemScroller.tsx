import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoHook from "../userInfo/UserInfoHook";
import { PagedItemPresenter, PagedItemView } from "../../presenters/PagedItemPresenter";
import { UserNavigationPresenter, UserNavigationView } from "../../presenters/UserNavigationPresenter";

interface Props<T, U> {
  presenterGenerator: (view: PagedItemView<T>) => PagedItemPresenter<T, U>;
  navPresenterGenerator: (view: UserNavigationView) => UserNavigationPresenter;
  itemComponentGenerator: (item: T, navPresenterGenerator: (view: UserNavigationView) => UserNavigationPresenter) => JSX.Element;
}

const ItemScroller = <T, U>({
  presenterGenerator,
  navPresenterGenerator,
  itemComponentGenerator,
}: Props<T, U>) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<T[]>([]);
  const [newItems, setNewItems] = useState<T[]>([]);
  const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);
  const { displayedUser, authToken } = useUserInfoHook();

  // Reset the component whenever the displayed user changes
  useEffect(() => {
    reset();
  }, [displayedUser]);

  // Load initial items whenever the displayed user changes.
  useEffect(() => {
    if (changedDisplayedUser) {
      loadMoreItems();
    }
  }, [changedDisplayedUser]);

  // Append new items as they arrive.
  useEffect(() => {
    if (newItems.length > 0) {
      setItems((prevItems) => [...prevItems, ...newItems]);
    }
  }, [newItems]);

  const reset = async () => {
    setItems([]);
    setNewItems([]);
    setChangedDisplayedUser(true);
    presenter.reset();
  };

  const loadMoreItems = async () => {
    await presenter.loadMoreItems(authToken!, displayedUser!.alias);
    setChangedDisplayedUser(false);
  };

  const listener: PagedItemView<T> = {
    addItems: (items: T[]) => setNewItems(items),
    displayErrorMessage: displayErrorMessage,
  };

  const [presenter] = useState<PagedItemPresenter<T, U>>(() => presenterGenerator(listener));

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div key={index} className="row mb-3 mx-0 px-0 border rounded bg-white">
            {itemComponentGenerator(item, navPresenterGenerator)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ItemScroller;
