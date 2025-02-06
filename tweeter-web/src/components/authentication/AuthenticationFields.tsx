import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

interface Props {
    doEntry: () => Promise<void>;
}

const AuthenticationFields = (props: Props) => {
    const [alias, setAlias] = useState("");
    const [password, setPassword] = useState("");
    const checkSubmitButtonStatus = (): boolean => {
        return !alias || !password;
      };
    const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key == "Enter" && !checkSubmitButtonStatus()) {
          props.doEntry();
        }
      };
    return (
        <>
        <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          placeholder="name@example.com"
          onKeyDown={loginOnEnter}
          onChange={(event) => setAlias(event.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control bottom"
          id="passwordInput"
          placeholder="Password"
          onKeyDown={loginOnEnter}
          onChange={(event) => setPassword(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
      </>
    );
}
export default AuthenticationFields;