import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/UserService";

export interface AppNavbarView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
    authToken: AuthToken | null; 
    clearUserInfo: () => void;
}
    
  
export class AppNavbarPresenter {
    private _view: AppNavbarView;
    private userService: UserService;
    public constructor(view: AppNavbarView) {
        this._view = view;
        this.userService = new UserService();
    }

    public async logOut () {
        this.view.displayInfoMessage("Logging Out...", 0);
    
        try {
          await this.userService.logout(this.view.authToken!);
    
          this.view.clearLastInfoMessage();
          this.view.clearUserInfo();
          window.location.href = "/login";
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to log user out because of exception: ${error}`
          );
        }
      };

    public get view(){
        return this._view;
    }
}
