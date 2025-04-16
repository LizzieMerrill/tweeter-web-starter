import { UserDto, AuthToken } from "tweeter-shared";

export interface IUserDAO {
  getUserByAlias(alias: string): Promise<UserDto | null>;
  login(alias: string, password: string): Promise<{ user: UserDto; authToken: AuthToken }>;
  register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageUrl: string
  ): Promise<{ user: UserDto; authToken: AuthToken }>;
  updateFollowCounts(alias: string, followerCount: number, followeeCount: number): Promise<void>;
  getIsFollowerStatus(userAlias: string, selectedUserAlias: string): Promise<boolean>;
  verifyPassword(user: UserDto, password: string): Promise<boolean>;
  getFollowerCount(alias: string): Promise<number>;
  getFolloweeCount(alias: string): Promise<number>;
}
