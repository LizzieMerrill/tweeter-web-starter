// import { FakeData, User, UserDto } from "tweeter-shared";

// export class FollowService {
//       public async loadMoreFollowers(
//         token: string,
//         userAlias: string,
//         pageSize: number,
//         lastItem: UserDto | null
//       ): Promise<[UserDto[], boolean]> {
//         // TODO: Replace with the result of calling server
//         return this.getFakeData(lastItem, pageSize, userAlias);
//       };
    
//       public async loadMoreFollowees (
//         token: string,
//         userAlias: string,
//         pageSize: number,
//         lastItem: UserDto | null
//       ): Promise<[UserDto[], boolean]> {
//         // TODO: Replace with the result of calling server
//         return this.getFakeData(lastItem, pageSize, userAlias);
//       };

//   private async getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
//     const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
//     const dtos = items.map((user) => user.dto);
//     return [dtos, hasMore];
//   }
// }

import { UserDto } from "tweeter-shared";
import { IFollowDAO } from "../../dataAccess/dao/interfaces/IFollowDAO";

export class FollowService {
  private followDAO: IFollowDAO;

  constructor(followDAO: IFollowDAO) {
    this.followDAO = followDAO;
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return await this.followDAO.getFollowers(userAlias, pageSize, lastItem);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return await this.followDAO.getFollowees(userAlias, pageSize, lastItem);
  }
}
