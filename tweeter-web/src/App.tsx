// import "./App.css";
// import {
//   BrowserRouter,
//   Navigate,
//   Route,
//   Routes,
//   useLocation,
// } from "react-router-dom";
// import Login from "./components/authentication/login/Login";
// import Register from "./components/authentication/register/Register";
// import MainLayout from "./components/mainLayout/MainLayout";
// import Toaster from "./components/toaster/Toaster";
// import useUserInfoHook from "./components/userInfo/UserInfoHook";
// import { UserItemView } from "./presenters/UserItemPresenter";
// import { StatusItemView } from "./presenters/StatusItemPresenter";
// import { FeedPresenter } from "./presenters/FeedPresenter";
// import { StoryPresenter } from "./presenters/StoryPresenter";
// import { FolloweePresenter } from "./presenters/FolloweePresenter";
// import { FollowerPresenter } from "./presenters/FollowerPresenter";
// import { LoginPresenter, LoginView } from "./presenters/LoginPresenter";
// import { RegisterPresenter, RegisterView } from "./presenters/RegisterPresenter";
// import { UserNavigationPresenter, UserNavigationView } from "./presenters/UserNavigationPresenter";
// import ItemScroller from "./components/mainLayout/ItemScroller";
// import UserItem from "./components/userItem/UserItem";
// import StatusItem from "./components/userItem/UserItem";
// import { Status } from "tweeter-shared";

// const App = () => {
//   const { currentUser, authToken } = useUserInfoHook();

//   const isAuthenticated = (): boolean => {
//     return !!currentUser && !!authToken;
//   };

//   return (
//     <div>
//       <Toaster position="top-right" />
//       <BrowserRouter>
//         {isAuthenticated() ? (
//           <AuthenticatedRoutes />
//         ) : (
//           <UnauthenticatedRoutes />
//         )}
//       </BrowserRouter>
//     </div>
//   );
// };

// const AuthenticatedRoutes = () => {
//   return (
//     <Routes>
//       <Route element={<MainLayout />}>
//         <Route index element={<Navigate to="/feed" />} />
//         <Route path="feed" element={
//             <ItemScroller
//             key={3}
//             presenterGenerator={(view: StatusItemView) => new FeedPresenter(view)}
//             navPresenterGenerator={(view: UserNavigationView) => new UserNavigationPresenter(view)}
//             itemComponentGenerator={(
//               item: Status,
//               navPresenterGenerator: (view: UserNavigationView) => UserNavigationPresenter
//             ) => (
//               <StatusItem
//                 status={item}
//                 navPresenterGenerator={navPresenterGenerator}
//               />
//             )}
//           />
//         <Route path="story" element={<ItemScroller key={4} presenterGenerator={(view: StatusItemView) => new StoryPresenter(view)}/>} />
//         <Route
//           path="followees"
//           element={
//             <ItemScroller
//               key={1}
//               presenterGenerator={(view: UserItemView) => new FolloweePresenter(view)}
//               navPresenterGenerator={(view: UserNavigationView) => new UserNavigationPresenter(view)}
//             />
//           }
//         />
//         <Route
//           path="followers"
//           element={
//             <ItemScroller
//               key={2} 
//               presenterGenerator={(view: UserItemView) => new FollowerPresenter(view)}
//               navPresenterGenerator={(view: UserNavigationView) => new UserNavigationPresenter(view)}
//             />
//           }
//         />
//         <Route path="logout" element={<Navigate to="/login" />} />
//         <Route path="*" element={<Navigate to="/feed" />} />
//       </Route>
//     </Routes>
//   );
// };

// const UnauthenticatedRoutes = () => {
//   const location = useLocation();

//   return (
//     <Routes>
//       <Route path="/login" element={<Login presenterGenerator={(view: LoginView) => new LoginPresenter(view)}/>} />
//       <Route path="/register" element={<Register presenterGenerator={(view: RegisterView) => new RegisterPresenter(view)}/>} />
//       <Route path="*" element={<Login presenterGenerator={(view: LoginView) => new LoginPresenter(view)} originalUrl={location.pathname} />} />
//     </Routes>
//   );
// };

// export default App;


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
import { LoginPresenter } from "./presenters/LoginPresenter";
import { RegisterPresenter } from "./presenters/RegisterPresenter";
import { UserNavigationPresenter, UserNavigationView } from "./presenters/UserNavigationPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import UserItem from "./components/userItem/UserItem";
import StatusItem from "./components/statusItem/StatusItem";
import { Status } from "tweeter-shared";
import { AuthView } from "./presenters/AuthPresenter";

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
        element={<Login presenterGenerator={(view: AuthView) => new LoginPresenter(view)} />}
      />
      <Route
        path="/register"
        element={<Register presenterGenerator={(view: AuthView) => new RegisterPresenter(view)} />}
      />
      <Route
        path="*"
        element={
          <Login
            presenterGenerator={(view: AuthView) => new LoginPresenter(view)}
            originalUrl={location.pathname}
          />
        }
      />
    </Routes>
  );
};

export default App;
