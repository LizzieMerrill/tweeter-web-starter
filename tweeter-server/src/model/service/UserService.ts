import { Buffer } from "buffer";
import { AuthToken, FakeData, UserDto } from "tweeter-shared";

export class UserService {
  
  //login
  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthToken]>{
    const user = FakeData.instance.firstUser;
    
    if (user === null) {
      throw new Error("Invalid alias or password");
    }
    
    return [user.dto!, FakeData.instance.authToken];
  };

  //logout
  public async logout (token: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };

  //register
    public async register (
      firstName: string,
      lastName: string,
      alias: string,
      password: string,
      userImageBytes: string,
      imageFileExtension: string
    ): Promise<[UserDto, AuthToken]> {
      //**************DID BELOW COMMENTED OUT STEP IN CLIENT-SIDE USERSERVICE!!!***************
      // Not neded now, but will be needed when you make the request to the server in milestone 3
      // const imageStringBase64: string =
      //   Buffer.from(userImageBytes).toString("base64");
  
      // TODO: Replace with the result of calling the server
      const user = FakeData.instance.firstUser;
  
      if (user === null) {
        throw new Error("Invalid registration");
      }
  
      return [user.dto!, FakeData.instance.authToken];
    };

    //getuser for usernavigationhook
    public async getUser (
      token: string,
      alias: string
    ): Promise<UserDto | null> {
      // TODO: Replace with the result of calling server
      const user = (FakeData.instance.findUserByAlias(alias));
      return user!.dto == null ? null : user!.dto;
    };

    //follow
    public async follow (
      token: string,
      userToFollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
      // Pause so we can see the follow message. Remove when connected to the server
      return await this.getCounts(token, userToFollow);
    };

    //unfollow
    public async unfollow (
      token: string,
      userToUnfollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
      // Pause so we can see the unfollow message. Remove when connected to the server
      return await this.getCounts(token, userToUnfollow);
    };

  private async getCounts(token: string, userToUnfollow: UserDto): Promise<[followerCount: number, followeeCount: number]> {
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server
    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }

  //user info
  public async getIsFollowerStatus (
    token: string,
    user: UserDto | null,
    selectedUser: UserDto | null
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  };

  //more user info
  public async getFolloweeCount (
    token: string,
    user: UserDto
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  };

  //oh look, even more user info
  public async getFollowerCount (
    token: string,
    user: UserDto
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  };
}