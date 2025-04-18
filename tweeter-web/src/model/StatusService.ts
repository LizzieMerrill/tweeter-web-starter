import { AuthToken, Status } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade"

export class StatusService {
    
  serverFacade = new ServerFacade();
  
  //story
    public async loadMoreStoryItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItemStatus: Status | null
      ): Promise<[Status[], boolean]> {
        // TODO: Replace with the result of calling server
        const token = authToken.token;
        const lastItem = lastItemStatus ? lastItemStatus.dto : null;
        return this.serverFacade.getStoryItems({token, userAlias, pageSize, lastItem});
      };
  
      //feed
      public async loadMoreFeedItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItemStatus: Status | null
      ): Promise<[Status[], boolean]> {
        const token = authToken.token;
        const lastItem = lastItemStatus ? lastItemStatus.dto : null;
        return this.serverFacade.getFeedItems({token, userAlias, pageSize, lastItem});
      };

      //post status
      public async postStatus(
        authToken: AuthToken,
        newStatusItem: Status
      ): Promise<void> {
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        const token = authToken.token;
        const newStatus = newStatusItem.dto;
        return this.serverFacade.postStatus({token, newStatus});
      };
}