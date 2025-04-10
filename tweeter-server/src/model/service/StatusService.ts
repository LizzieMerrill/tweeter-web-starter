import { FakeData, Status, StatusDto } from "tweeter-shared";

export class StatusService {
    //story
    public async loadMoreStoryItems (
      token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
      ): Promise<[StatusDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize);
      };
  
  private async getFakeData(lastItem: StatusDto | null, pageSize: number): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
    const dtos = items.map((status) => status.dto);
    return [dtos, hasMore];
  }

      //feed
      public async loadMoreFeedItems (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
      ): Promise<[StatusDto[], boolean]> {
        return this.getFakeData(lastItem, pageSize);
      };

      //post status
      public async postStatus(
        token: string,
        newStatus: StatusDto
      ): Promise<void> {
    
        // TODO: Call the server to post the status
      };
}