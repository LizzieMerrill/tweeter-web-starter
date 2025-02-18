import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/UserService";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface LoginView{

}

export class LoginPresenter extends AuthPresenter {
    private userService: UserService;
    public constructor(view: AuthView) {
        super(view);
        this.userService = new UserService();
    }
    public async login (
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    return this.userService.login(alias, password);
  };
}