import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfoHook from "../../userInfo/UserInfoHook";
import { LoginPresenter, LoginView } from "../../../presenters/LoginPresenter";

interface Props {
  originalUrl?: string;
  presenterGenerator: (view: LoginView, originalUrl?: string) => LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoHook();
  const { displayErrorMessage } = useToastListener();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const inputFieldGenerator = () => {
    return (
      <>
        <AuthenticationFields 
            alias={alias} 
            setAlias={setAlias} 
            password={password} 
            setPassword={setPassword} 
            doEntry={() => presenter.doLogin()} 
        />
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  const listener: LoginView = {
    displayErrorMessage: displayErrorMessage,
    updateUserInfo: updateUserInfo,
    navigate: (path: string) => navigate(path), 
    getAlias: () => alias,
    getPassword: () => password,
    getRememberMe: () => rememberMe,
    setLoading: (isLoading: boolean) => setIsLoading(isLoading),
  }
  
  const [presenter] = useState(props.presenterGenerator(listener, props.originalUrl));

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={() => presenter.doLogin()}
    />
  );
};

export default Login;
