import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface AuthView extends View{
      updateUserInfo: (user: User, authUser: User, token: AuthToken, rememberMe: boolean) => void;
      navigate: (path: string) => void;
      getAlias: () => string;
      getPassword: () => string;
      getRememberMe: () => boolean;
      setLoading: (isLoading: boolean) => void;
      getFirstName: () => string;//register only
      getLastName: () => string;//register only
}

export abstract class AuthPresenter extends Presenter<AuthView>{
    protected alias = this.view.getAlias();
    protected password = this.view.getPassword();
    protected rememberMe = this.view.getRememberMe();
    protected constructor(view: AuthView) {
        super(view);
    }
    protected doAuthenticationOperation(originalUrl?: string) {
        if (!!originalUrl) {
            return originalUrl;
        } else {
            return "/";
        }
    };
}