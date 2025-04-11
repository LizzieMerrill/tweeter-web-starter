import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService {

   serverFacade = new ServerFacade();

      public async loadMoreFollowers(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItemUser: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        const token = authToken.token;
        const lastItem = lastItemUser ? lastItemUser.dto : null;
        return this.serverFacade.getMoreFollowers({token, userAlias, pageSize, lastItem});
      };
    
      public async loadMoreFollowees (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItemUser: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        const token = authToken.token;
        const lastItem = lastItemUser ? lastItemUser.dto : null;
        return this.serverFacade.getMoreFollowers({token, userAlias, pageSize, lastItem});
      };
}