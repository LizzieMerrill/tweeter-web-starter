import { UserService } from "../model/UserService";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter{
    private userService: UserService;
    private originalUrl?: string;
    public constructor(view: AuthView, originalUrl?: string) {
        super(view);
        this.userService = new UserService();
        this.originalUrl = originalUrl;
    }

  public async doLogin (alias: string, password: string, originalUrl?: string) {
    await this.doFailureReportingOperation(async () => {
      this.view.setLoading(true);

      this.doAuthenticationOperation(() => this.userService.login(this.alias, this.password), this.originalUrl);
  }, "log user in", () => this.view.setLoading(false)); //finally callback 
  };
}