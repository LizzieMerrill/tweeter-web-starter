import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/UserService";

export interface UserNavigationView {

}
export class UserNavigationPresenter {
    private _view: UserNavigationView;
    private userService: UserService;
    public constructor(view: UserNavigationView) {
        this._view = view;
        this.userService = new UserService();
    }

        public async getUser (
          authToken: AuthToken,
          alias: string
        ): Promise<User | null> {
          return this.userService.getUser(authToken, alias);
        };

    public get view(){
        return this._view;
    }
}
