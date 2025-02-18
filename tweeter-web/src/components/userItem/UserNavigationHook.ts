import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoHook from "../userInfo/UserInfoHook";
import { UserNavigationPresenter, UserNavigationView } from "../../presenters/UserNavigationPresenter";
import { useState } from "react";

interface Props {
  navPresenterGenerator: (view: UserNavigationView) => UserNavigationPresenter;
}

const useUserNavigationHook = (props: Props) =>{
    const { displayErrorMessage } = useToastListener();
      const { setDisplayedUser, currentUser, authToken } =
        useUserInfoHook();

      const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        await presenter.navigateToUser(event);
      };

          const listener: UserNavigationView = {
            displayErrorMessage: displayErrorMessage,
            setDisplayedUser: setDisplayedUser,
            authToken: authToken,
            currentUser: currentUser,
          }
          
          const [presenter] = useState(props.navPresenterGenerator(listener));

    return navigateToUser;
}
export default useUserNavigationHook;