import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/UserService";

export interface UserInfoView {

}
export class UserInfoPresenter {
    private _view: UserInfoView;
    private userService: UserService;
    public constructor(view: UserInfoView) {
        this._view = view;
        this.userService = new UserService();
    }

  public async getIsFollowerStatus (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    return this.userService.getIsFollowerStatus(authToken, user, selectedUser);
  };

    public async getFolloweeCount (
      authToken: AuthToken,
      user: User
    ): Promise<number> {
      return this.userService.getFolloweeCount(authToken, user);
    };

      public async getFollowerCount (
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        return this.userService.getFollowerCount(authToken, user);
      };

    public get view(){
        return this._view;
    }
}
