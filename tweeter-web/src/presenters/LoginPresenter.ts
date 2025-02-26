import { AuthToken, User } from "tweeter-shared";
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

    public async login (
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    return this.userService.login(alias, password);
  };

  public async doLogin () {
    await this.doFailureReportingOperation(async () => {
      this.view.setLoading(true);

      const [user, authToken] = await this.login(this.alias, this.password);

      this.view.updateUserInfo(user, user, authToken, this.rememberMe);
      this.view.navigate(this.doAuthenticationOperation(this.originalUrl));
  }, "log user in", () => this.view.setLoading(false)); //finally callback
  };
}