import { Status, Type } from "tweeter-shared";
import { Link } from "react-router-dom";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoHook from "../userInfo/UserInfoHook";
import useUserNavigationHook from "../userItem/UserNavigationHook";
import { UserNavigationPresenter, UserNavigationView } from "../../presenters/UserNavigationPresenter";

interface Props {
  status: Status;
  navPresenterGenerator: (view: UserNavigationView) => UserNavigationPresenter;
}

const Post = (props: Props) => {
  const { setDisplayedUser, currentUser, authToken } =
    useUserInfoHook();
  const { displayErrorMessage } = useToastListener();

  const navigateToUser = useUserNavigationHook(props);

  return (
    <>
      {props.status.segments.map((segment, index) =>
        segment.type === Type.alias ? (
          <Link
            key={index}
            to={segment.text}
            onClick={(event) => navigateToUser(event)}
          >
            {segment.text}
          </Link>
        ) : segment.type === Type.url ? (
          <a
            key={index}
            href={segment.text}
            target="_blank"
            rel="noopener noreferrer"
          >
            {segment.text}
          </a>
        ) : segment.type === Type.newline ? (
          <br key={index} />
        ) : (
          segment.text
        )
      )}
    </>
  );
};

export default Post;
