// import { FakeData, Status, StatusDto } from "tweeter-shared";

// export class StatusService {
//     //story
//     public async loadMoreStoryItems (
//       token: string,
//         userAlias: string,
//         pageSize: number,
//         lastItem: StatusDto | null
//       ): Promise<[StatusDto[], boolean]> {
//         // TODO: Replace with the result of calling server
//         return this.getFakeData(lastItem, pageSize);
//       };
  
//   private async getFakeData(lastItem: StatusDto | null, pageSize: number): Promise<[StatusDto[], boolean]> {
//     const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
//     const dtos = items.map((status) => status.dto);
//     return [dtos, hasMore];
//   }

//       //feed
//       public async loadMoreFeedItems (
//         token: string,
//         userAlias: string,
//         pageSize: number,
//         lastItem: StatusDto | null
//       ): Promise<[StatusDto[], boolean]> {
//         return this.getFakeData(lastItem, pageSize);
//       };

//       //post status
//       public async postStatus(
//         token: string,
//         newStatus: StatusDto
//       ): Promise<void> {
    
//         // TODO: Call the server to post the status
//       };
// }


import { StatusDto } from "tweeter-shared";
import { IStatusDAO } from "../../dataAccess/dao/interfaces/IStatusDAO";

export class StatusService {
  private statusDAO: IStatusDAO;

  constructor(statusDAO: IStatusDAO) {
    this.statusDAO = statusDAO;
  }

  // Load story items using the DAO.
  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return await this.statusDAO.loadStory(userAlias, pageSize, lastItem);
  }

  // Load feed items using the DAO.
  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return await this.statusDAO.loadFeed(userAlias, pageSize, lastItem);
  }

  // Post a status update.
  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    await this.statusDAO.postStatus(newStatus);
  }
}
