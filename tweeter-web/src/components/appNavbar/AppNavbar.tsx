import "./AppNavbar.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoHook from "../userInfo/UserInfoHook";
import { AppNavbarPresenter, AppNavbarView } from "../../presenters/AppNavbarPresenter";
import { useState } from "react";


interface Props {
  presenter?: AppNavbarPresenter;
}

const AppNavbar = (props: Props) => {
  const location = useLocation();
  const { authToken, clearUserInfo } = useUserInfoHook();
  const { displayInfoMessage, displayErrorMessage, clearLastInfoMessage } =
    useToastListener();
    const navigate = useNavigate();

    const listener: AppNavbarView = {
      displayErrorMessage: displayErrorMessage,
      displayInfoMessage: displayInfoMessage,
      clearLastInfoMessage: clearLastInfoMessage,
      authToken,
      clearUserInfo
    };
    
      
  const [presenter] = useState(props.presenter ?? new AppNavbarPresenter(listener));

  return (
    <Navbar
      collapseOnSelect
      className="mb-4"
      expand="md"
      bg="primary"
      variant="dark"
    >
      <Container>
        <Navbar.Brand>
          <div className="d-flex flex-row">
            <div className="p-2">
              <NavLink className="brand-link" to="/">
                <Image src={"./bird-white-32.png"} alt="" />
              </NavLink>
            </div>
            <div id="brand-title" className="p-3">
              <NavLink className="brand-link" to="/">
                <b>Tweeter</b>
              </NavLink>
            </div>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Item>
              <NavLink to="/feed">Feed</NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/story">Story</NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/followees">Followees</NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/followers">Followers</NavLink>
            </Nav.Item>
            <Nav.Item>
            {/* onClick={presenter.logOut}  */}
              <NavLink id="logout" onClick={() => {presenter.logOut(authToken).then(() => navigate("/login"))}} to={location.pathname}> 
                Logout
              </NavLink>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
