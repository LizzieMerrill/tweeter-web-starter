import { FakeData, User, UserDto } from "tweeter-shared";

export class FollowService {
      public async loadMoreFollowers(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize, userAlias);
      };
    
      public async loadMoreFollowees (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize, userAlias);
      };

  private async getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(this.getDomainObject(lastItem), pageSize, userAlias);
    const dtos = items.map((user) => this.createDto(user));
    return [dtos, hasMore];
  }

      private createDto(user: User): UserDto{
        return{
          firstName: user.firstName,
          lastName: user.lastName,
          alias: user.alias,
          imageUrl: user.imageUrl
        }
      }

      private getDomainObject(dto: UserDto | null): User | null{
        return dto == null ? null : new User(dto.firstName, dto.lastName, dto.alias, dto.imageUrl);
      }
}