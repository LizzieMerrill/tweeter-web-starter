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
    protected async doAuthenticationOperation(
        doEntry: (        
            alias: string,
            password: string,
            firstName?: string,
            lastName?: string,
            imageBytes?: Uint8Array<ArrayBufferLike>,
            imageFileExtension?: string
        ) => Promise<[User, AuthToken]>, 
        originalUrl?: string, 
        imageBytes?: Uint8Array<ArrayBufferLike>, 
        imageFileExtension?: string
    ) {
        let user: User, authToken: AuthToken;
    
        if (this.view.getFirstName() && this.view.getLastName() && imageBytes && imageFileExtension) {
            [user, authToken] = await doEntry(
                this.view.getFirstName(), 
                this.view.getLastName(), 
                this.alias, 
                this.password, 
                imageBytes, 
                imageFileExtension
            );
        } else {
            [user, authToken] = await doEntry(this.alias, this.password);
        }
    
        this.view.updateUserInfo(user, user, authToken, this.rememberMe);
    
        if (!!originalUrl) {
            this.view.navigate(originalUrl);
        } else {
            this.view.navigate("/");
        }
    }    
}

