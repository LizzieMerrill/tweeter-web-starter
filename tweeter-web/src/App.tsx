import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfoHook from "./components/userInfo/UserInfoHook";
import { UserItemView } from "./presenters/UserItemPresenter";
import { StatusItemView } from "./presenters/StatusItemPresenter";
import { FeedPresenter } from "./presenters/FeedPresenter";
import { StoryPresenter } from "./presenters/StoryPresenter";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { UserNavigationPresenter, UserNavigationView } from "./presenters/UserNavigationPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import UserItem from "./components/userItem/UserItem";
import StatusItem from "./components/statusItem/StatusItem";
import { Status } from "tweeter-shared";

const App = () => {
  const { currentUser, authToken } = useUserInfoHook();

  const isAuthenticated = (): boolean => !!currentUser && !!authToken;

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />

        <Route
          path="feed"
          element={
            <ItemScroller
              key={3}
              presenterGenerator={(view: StatusItemView) => new FeedPresenter(view)}
              navPresenterGenerator={(view: UserNavigationView) =>
                new UserNavigationPresenter(view)
              }
              itemComponentGenerator={(
                item: Status,
                navPresenterGenerator: (view: UserNavigationView) => UserNavigationPresenter
              ) => (
                <StatusItem
                  status={item}
                  navPresenterGenerator={navPresenterGenerator}
                />
              )}
            />
          }
        />

        <Route
          path="story"
          element={
            <ItemScroller
              key={4}
              presenterGenerator={(view: StatusItemView) => new StoryPresenter(view)}
              navPresenterGenerator={(view: UserNavigationView) =>
                new UserNavigationPresenter(view)
              }
              itemComponentGenerator={(
                item: Status,
                navPresenterGenerator: (view: UserNavigationView) => UserNavigationPresenter
              ) => (
                <StatusItem
                  status={item}
                  navPresenterGenerator={navPresenterGenerator}
                />
              )}
            />
          }
        />

        <Route
          path="followees"
          element={
            <ItemScroller
              key={1}
              presenterGenerator={(view: UserItemView) => new FolloweePresenter(view)}
              navPresenterGenerator={(view: UserNavigationView) =>
                new UserNavigationPresenter(view)
              }
              itemComponentGenerator={(
                item,
                navPresenterGenerator: (view: UserNavigationView) => UserNavigationPresenter
              ) => (
                <UserItem value={item} navPresenterGenerator={navPresenterGenerator} />
              )}
            />
          }
        />

        <Route
          path="followers"
          element={
            <ItemScroller
              key={2}
              presenterGenerator={(view: UserItemView) => new FollowerPresenter(view)}
              navPresenterGenerator={(view: UserNavigationView) =>
                new UserNavigationPresenter(view)
              }
              itemComponentGenerator={(
                item,
                navPresenterGenerator: (view: UserNavigationView) => UserNavigationPresenter
              ) => (
                <UserItem value={item} navPresenterGenerator={navPresenterGenerator} />
              )}
            />
          }
        />

        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/register"
        element={<Register />}
      />
      <Route
        path="*"
        element={
          <Login originalUrl={location.pathname}/>
        }
      />
    </Routes>
  );
};

export default App;
