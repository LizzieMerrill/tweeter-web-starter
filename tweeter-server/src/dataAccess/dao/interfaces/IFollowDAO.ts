import { UserDto } from "tweeter-shared";

export interface IFollowDAO {
  getFollowers(
    userAlias: string,
    pageSize: number,
    lastItem?: UserDto | null
  ): Promise<[UserDto[], boolean]>;
  getFollowees(
    userAlias: string,
    pageSize: number,
    lastItem?: UserDto | null
  ): Promise<[UserDto[], boolean]>;
  follow(followerAlias: string, followeeAlias: string): Promise<void>;
  unfollow(followerAlias: string, followeeAlias: string): Promise<void>;
}
