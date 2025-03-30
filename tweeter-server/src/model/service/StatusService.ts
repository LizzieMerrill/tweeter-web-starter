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
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(this.getDomainObject(lastItem), pageSize);
    const dtos = items.map((status) => this.createDto(status));
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
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server to post the status
      };

      private createDto(status: Status): StatusDto{
        return{
          post: status.post,
          user: status.user,
          timestamp: status.timestamp,
          segments: status.segments
        }
      }

      private getDomainObject(dto: StatusDto | null): Status | null{
        return dto == null ? null : new Status(dto.post, dto.user, dto.timestamp);
      }
}