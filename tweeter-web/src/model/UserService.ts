import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade"

export class UserService {
  
  serverFacade = new ServerFacade();

  //login
  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]>{

    const [userDto, authToken] = await this.serverFacade.login({alias, password});
    const user = User.fromDto(userDto);

    if (user === null) {
      throw new Error("Invalid alias or password");
    }
    return [user, authToken];
  };

  //logout
  public async logout (authToken: AuthToken): Promise<void> {
    // // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    // await new Promise((res) => setTimeout(res, 1000));

    const token = authToken.token;
    this.serverFacade.logout({token});
  };

  //register
    public async register (
      firstName: string,
      lastName: string,
      alias: string,
      password: string,
      userImageBytesItem: Uint8Array,
      imageFileExtension: string
    ): Promise<[User, AuthToken]> {
      // Not neded now, but will be needed when you make the request to the server in milestone 3
      const userImageBytes: string =
        Buffer.from(userImageBytesItem).toString("base64");
  
      // TODO: Replace with the result of calling the server
      const [userDto, authToken] = await this.serverFacade.register({firstName, lastName, alias, password, userImageBytes, imageFileExtension});
      const user = User.fromDto(userDto);
  
      if (user === null) {
        throw new Error("Invalid registration");
      }
  
      return [user, authToken];
    };

    //getuser for usernavigationhook
    public async getUser (
      authToken: AuthToken,
      alias: string
    ): Promise<User> {
      // TODO: Replace with the result of calling server
      const token = authToken.token;
      return this.serverFacade.getUser({token, alias});
    };

    //follow
    public async follow (
      authToken: AuthToken,
      userToFollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
      // Pause so we can see the follow message. Remove when connected to the server
      await new Promise((f) => setTimeout(f, 2000));

      const token = authToken.token;
      const userToFollowOrUnfollow = userToFollow
      this.serverFacade.follow({token, userToFollowOrUnfollow});
  
      // TODO: Call the server
      const followerCount = await this.getFollowerCount(authToken, userToFollow);
      const followeeCount = await this.getFolloweeCount(authToken, userToFollow);
  
      return [followerCount, followeeCount];
    };

    //unfollow
    public async unfollow (
      authToken: AuthToken,
      userToUnfollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
      // Pause so we can see the unfollow message. Remove when connected to the server
      await new Promise((f) => setTimeout(f, 2000));

      const token = authToken.token;
      const userToFollowOrUnfollow = userToUnfollow
      this.serverFacade.unfollow({token, userToFollowOrUnfollow});
  
      // TODO: Call the server
      const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
      const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);
  
      return [followerCount, followeeCount];
    };

  //user info
  public async getIsFollowerStatus (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    const token = authToken.token;
    return this.serverFacade.checkIfFollowing({token, user, selectedUser});
  };

  //more user info
  public async getFolloweeCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    const token = authToken.token;
    return this.serverFacade.getFolloweeCount({token, user});
  };

  //oh look, even more user info
  public async getFollowerCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    const token = authToken.token;
    return this.serverFacade.getFollowerCount({token, user});
  };
}