import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/UserService";

export interface UserInfoView {
    setIsFollower: (isFollower: boolean) => void;
    setFolloweeCount: (count: number) => void;
    setFollowerCount: (count: number) => void;
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
    setIsLoading: (loading: boolean) => void;
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

      public async setIsFollowerStatus (
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
      ) {
        try {
          if (currentUser === displayedUser) {
            this.view.setIsFollower(false);
          } else {
            this.view.setIsFollower(
              await this.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
            );
          }
        } catch (error) {
            this.view.displayErrorMessage(
            `Failed to determine follower status because of exception: ${error}`
          );
        }
      };

      public async setNumbFollowees (
        authToken: AuthToken,
        displayedUser: User
      ) {
        try {
            this.view.setFolloweeCount(await this.getFolloweeCount(authToken, displayedUser));
        } catch (error) {
            this.view.displayErrorMessage(
            `Failed to get followees count because of exception: ${error}`
          );
        }
      };

      public async setNumbFollowers (
        authToken: AuthToken,
        displayedUser: User
      ) {
        try {
            this.view.setFollowerCount(await this.getFollowerCount(authToken, displayedUser));
        } catch (error) {
            this.view.displayErrorMessage(
            `Failed to get followers count because of exception: ${error}`
          );
        }
      };

      public async followDisplayedUser (
        event: React.MouseEvent,
        authToken: AuthToken,
        displayedUser: User
      ): Promise<void> {
        event.preventDefault();
    
        try {
            this.view.setIsLoading(true);
            this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);
    
          const [followerCount, followeeCount] = await this.userService.follow(
            authToken!,
            displayedUser!
          );
    
          this.view.setIsFollower(true);
          this.view.setFollowerCount(followerCount);
          this.view.setFolloweeCount(followeeCount);
        } catch (error) {
            this.view.displayErrorMessage(
            `Failed to follow user because of exception: ${error}`
          );
        } finally {
            this.view.clearLastInfoMessage();
            this.view.setIsLoading(false);
        }
      };

      public async unfollowDisplayedUser (
        event: React.MouseEvent,
        authToken: AuthToken,
        displayedUser: User
      ): Promise<void> {
        event.preventDefault();
    
        try {
            this.view.setIsLoading(true);
            this.view.displayInfoMessage(
            `Unfollowing ${displayedUser!.name}...`,
            0
          );
    
          const [followerCount, followeeCount] = await this.userService.unfollow(
            authToken!,
            displayedUser!
          );
    
          this.view.setIsFollower(false);
          this.view.setFollowerCount(followerCount);
          this.view.setFolloweeCount(followeeCount);
        } catch (error) {
            this.view.displayErrorMessage(
            `Failed to unfollow user because of exception: ${error}`
          );
        } finally {
            this.view.clearLastInfoMessage();
            this.view.setIsLoading(false);
        }
      };

    public get view(){
        return this._view;
    }
}
