import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView{
    setIsFollower: (isFollower: boolean) => void;
    setFolloweeCount: (count: number) => void;
    setFollowerCount: (count: number) => void;
    setIsLoading: (loading: boolean) => void;
  }
  
export class UserInfoPresenter extends Presenter<UserInfoView>{
    private userService: UserService;
    public constructor(view: UserInfoView) {
        super(view);
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
        this.doFailureReportingOperation(async () => {
          if (currentUser === displayedUser) {
            this.view.setIsFollower(false);
          } else {
            this.view.setIsFollower(
              await this.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
            );
          }
        }, "determine follower status");  
      };

      public async setNumbFollowees (
        authToken: AuthToken,
        displayedUser: User
      ) {
        this.doFailureReportingOperation(async () => {
          this.view.setFolloweeCount(await this.getFolloweeCount(authToken, displayedUser));
        }, "get followees count");  
      };

      public async setNumbFollowers (
        authToken: AuthToken,
        displayedUser: User
      ) {

        this.doFailureReportingOperation(async () => {
          this.view.setFollowerCount(await this.getFollowerCount(authToken, displayedUser));
        }, "get followers count");  
      };

      public async followDisplayedUser (
        event: React.MouseEvent,
        authToken: AuthToken,
        displayedUser: User
      ): Promise<void> {
        event.preventDefault();
        
        await this.doFailureReportingOperation(async () => {
          this.view.setIsLoading(true);
          this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);
  
        const [followerCount, followeeCount] = await this.userService.follow(
          authToken!,
          displayedUser!
        );
  
        this.view.setIsFollower(true);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      }, "follow user", () =>             
        {this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);}); //finally callback
      };

      public async unfollowDisplayedUser (
        event: React.MouseEvent,
        authToken: AuthToken,
        displayedUser: User
      ): Promise<void> {
        event.preventDefault();
    

        await this.doFailureReportingOperation(async () => {
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
      }, "unfollow user", () =>             
        {this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);}); //finally callback
      };
}
