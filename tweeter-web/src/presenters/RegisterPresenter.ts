import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/UserService";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface RegisterView{

}

export class RegisterPresenter extends AuthPresenter {
    private userService: UserService;
    public constructor(view: AuthView) {
        super(view);
        this.userService = new UserService();
    }
    public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {
        return this.userService.register(firstName, lastName, alias, password, userImageBytes, imageFileExtension);
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