import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/UserService";

export interface LoginView{
  displayErrorMessage: (message: string) => void;
  updateUserInfo: (user: User, authUser: User, token: AuthToken, rememberMe: boolean) => void;
  navigate: (path: string) => void;
  getAlias: () => string;
  getPassword: () => string;
  getRememberMe: () => boolean;
  setLoading: (isLoading: boolean) => void;
}

export class LoginPresenter {
    private userService: UserService;
    private view: LoginView;
    private originalUrl?: string; // Store originalUrl here
    public constructor(view: LoginView, originalUrl?: string) {
        this.view = view;
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
    try {
      this.view.setLoading(true);

      const alias = this.view.getAlias();
      const password = this.view.getPassword();
      const rememberMe = this.view.getRememberMe();

      const [user, authToken] = await this.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!this.originalUrl) {
        this.view.navigate(this.originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this.view.setLoading(false);
    }
  };
}