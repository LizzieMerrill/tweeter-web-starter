import { Status } from "tweeter-shared";
import { Link } from "react-router-dom";
import Post from "./Post";
import useUserNavigationHook from "../userItem/UserNavigationHook";
import { UserNavigationPresenter, UserNavigationView } from "../../presenters/UserNavigationPresenter";

interface Props {
    status: Status;
    navPresenterGenerator: (view: UserNavigationView) => UserNavigationPresenter;
}

const StatusItem = (props: Props) => {
        const navigateToUser = useUserNavigationHook(props);
    
    return (
        <div className="col bg-light mx-0 px-0">
        <div className="container px-0">
          <div className="row mx-0 px-0">
            <div className="col-auto p-3">
              <img
                src={props.status.user.imageUrl}
                className="img-fluid"
                width="80"
                alt="Posting user"
              />
            </div>
            <div className="col">
              <h2>
                <b>
                  {props.status.user.firstName} {props.status.user.lastName}
                </b>{" "}
                -{" "}
                <Link
                  to={props.status.user.alias}
                  onClick={(event) => navigateToUser(event)}
                >
                  {props.status.user.alias}
                </Link>
              </h2>
              {props.status.formattedDate}
              <br />
              <Post status={props.status} navPresenterGenerator={(view: UserNavigationView) => new UserNavigationPresenter(view)} />
            </div>
          </div>
        </div>
      </div>
    );
}
export default StatusItem;