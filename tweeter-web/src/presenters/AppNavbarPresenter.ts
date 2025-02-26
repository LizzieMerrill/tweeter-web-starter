import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface AppNavbarView extends MessageView{
    authToken: AuthToken | null; 
    clearUserInfo: () => void;
}
    
  
export class AppNavbarPresenter extends Presenter<AppNavbarView> {
    private userService: UserService;
    public constructor(view: AppNavbarView) {
        super(view);
        this.userService = new UserService();
    }

    public async logOut () {
        this.view.displayInfoMessage("Logging Out...", 0);

        this.doFailureReportingOperation(async () => {
          await this.userService.logout(this.view.authToken!);
    
          this.view.clearLastInfoMessage();
          this.view.clearUserInfo();
        }, "log user out");  
    };
}
