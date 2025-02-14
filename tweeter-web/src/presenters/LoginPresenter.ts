import { UserService } from "../model/UserService";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter {
    private userService: UserService;
    public constructor(view: AuthView) {
        super(view);
        this.userService = new UserService();
    }
    
    public async doLogin () {
        try {
          setIsLoading(true);
    
          const [user, authToken] = await this.userService.login(alias, password);
    
          updateUserInfo(user, user, authToken, rememberMe);
    
          if (!!props.originalUrl) {
            navigate(props.originalUrl);
          } else {
            navigate("/");
          }
        } catch (error) {
          displayErrorMessage(
            `Failed to log user in because of exception: ${error}`
          );
        } finally {
          setIsLoading(false);
        }
      };
}



// import { AuthToken } from 'tweeter-shared';
// import { FollowService } from '../model/FollowService';
// import { UserItemPresenter, UserItemView } from './UserItemPresenter';

// export const PAGE_SIZE = 10;

// export class FolloweePresenter extends UserItemPresenter {
//     private followService: FollowService;
//     public constructor(view: UserItemView) {
//         super(view);
//         this.followService = new FollowService();
//     }
//       public async loadMoreItems(authToken: AuthToken, userAlias: string) {
//         try {
//           const [newItems, hasMore] = await this.followService.loadMoreFollowees(
//             authToken,
//             userAlias,
//             PAGE_SIZE,
//             this.lastItem
//           );
    
//           this.hasMoreItems = hasMore;
//           this.lastItem = newItems[newItems.length - 1];
//           this.view.addItems(newItems);
//         } catch (error) {
//           this.view.displayErrorMessage(
//             `Failed to load followees because of exception: ${error}`
//           );
//         }
//       };
// }