import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService {

   serverFacade = new ServerFacade();

      public async loadMoreFollowers(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        const token = authToken.token;
        return this.serverFacade.getMoreFollowers({token, userAlias, pageSize, lastItem});//FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
      };
    
      public async loadMoreFollowees (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        const token = authToken.token;
        return this.serverFacade.getMoreFollowers({token, userAlias, pageSize, lastItem});
      };
}