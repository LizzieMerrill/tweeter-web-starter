// import { Buffer } from "buffer";
// import { AuthToken, FakeData, UserDto } from "tweeter-shared";

// export class UserService {
  
//   //login
//   public async login(
//     alias: string,
//     password: string
//   ): Promise<[UserDto, AuthToken]>{
//     const user = FakeData.instance.firstUser;
    
//     if (user === null) {
//       throw new Error("Invalid alias or password");
//     }
    
//     return [user.dto!, FakeData.instance.authToken];
//   };

//   //logout
//   public async logout (token: string): Promise<void> {
//     // Pause so we can see the logging out message. Delete when the call to the server is implemented.
//     await new Promise((res) => setTimeout(res, 1000));
//   };

//   //register
//     public async register (
//       firstName: string,
//       lastName: string,
//       alias: string,
//       password: string,
//       userImageBytes: string,
//       imageFileExtension: string
//     ): Promise<[UserDto, AuthToken]> {
//       //**************DID BELOW COMMENTED OUT STEP IN CLIENT-SIDE USERSERVICE!!!***************
//       // Not neded now, but will be needed when you make the request to the server in milestone 3
//       // const imageStringBase64: string =
//       //   Buffer.from(userImageBytes).toString("base64");
  
//       // TODO: Replace with the result of calling the server
//       const user = FakeData.instance.firstUser;
  
//       if (user === null) {
//         throw new Error("Invalid registration");
//       }
  
//       return [user.dto!, FakeData.instance.authToken];
//     };

//     //getuser for usernavigationhook
//     public async getUser (
//       token: string,
//       alias: string
//     ): Promise<UserDto | null> {
//       // TODO: Replace with the result of calling server
//       const user = (FakeData.instance.findUserByAlias(alias));
//       return user!.dto == null ? null : user!.dto;
//     };

//     //follow
//     public async follow (
//       token: string,
//       userToFollow: UserDto
//     ): Promise<[followerCount: number, followeeCount: number]> {
//       // Pause so we can see the follow message. Remove when connected to the server
//       return await this.getCounts(token, userToFollow);
//     };

//     //unfollow
//     public async unfollow (
//       token: string,
//       userToUnfollow: UserDto
//     ): Promise<[followerCount: number, followeeCount: number]> {
//       // Pause so we can see the unfollow message. Remove when connected to the server
//       return await this.getCounts(token, userToUnfollow);
//     };

//   private async getCounts(token: string, userToUnfollow: UserDto): Promise<[followerCount: number, followeeCount: number]> {
//     await new Promise((f) => setTimeout(f, 2000));

//     // TODO: Call the server
//     const followerCount = await this.getFollowerCount(token, userToUnfollow);
//     const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

//     return [followerCount, followeeCount];
//   }

//   //user info
//   public async getIsFollowerStatus (
//     token: string,
//     user: UserDto | null,
//     selectedUser: UserDto | null
//   ): Promise<boolean> {
//     // TODO: Replace with the result of calling server
//     return FakeData.instance.isFollower();
//   };

//   //more user info
//   public async getFolloweeCount (
//     token: string,
//     user: UserDto
//   ): Promise<number> {
//     // TODO: Replace with the result of calling server
//     return FakeData.instance.getFolloweeCount(user.alias);
//   };

//   //oh look, even more user info
//   public async getFollowerCount (
//     token: string,
//     user: UserDto
//   ): Promise<number> {
//     // TODO: Replace with the result of calling server
//     return FakeData.instance.getFollowerCount(user.alias);
//   };
// }



import { Buffer } from "buffer";
import { AuthToken, UserDto } from "tweeter-shared";
import { IUserDAO } from "../../dataAccess/dao/interfaces/IUserDAO";
import { IS3DAO } from "../../dataAccess/dao/interfaces/IS3DAO";
import { IFollowDAO } from "../../dataAccess/dao/interfaces/IFollowDAO";
import { ISessionDAO } from "../../dataAccess/dao/interfaces/ISessionDAO";

export class UserService {
  private userDAO: IUserDAO;
  private s3DAO: IS3DAO;
  private followDAO: IFollowDAO;
  private sessionDAO: ISessionDAO;

  constructor(userDAO: IUserDAO, s3DAO: IS3DAO, followDAO: IFollowDAO, sessionDAO: ISessionDAO) {
    this.userDAO = userDAO;
    this.s3DAO = s3DAO;
    this.followDAO = followDAO;
    this.sessionDAO = sessionDAO;
  }

  // Login: Authenticate user and create session token
  public async login(alias: string, password: string): Promise<[UserDto, AuthToken]> {
    const user = await this.userDAO.getUserByAlias(alias);
    if (!user || !(await this.userDAO.verifyPassword(user, password))) {
      throw new Error("Invalid alias or password");
    }

    const authToken = AuthToken.Generate();
    const expiresAt = Math.floor(Date.now() / 1000) + (30 * 60); // 30 minutes in seconds
    await this.sessionDAO.createSession(authToken.token, user.alias, expiresAt, Date.now());
    return [user, authToken];
  }

  // Logout: Invalidate session token
  public async logout(token: string): Promise<void> {
    await this.sessionDAO.deleteSession(token);
  }

  // Register: Upload profile image, create user, and session token
  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthToken]> {
    const imageBuffer = Buffer.from(userImageBytes, "base64");
    const imageUrl = await this.s3DAO.uploadProfileImage(alias, imageBuffer, imageFileExtension);

    const response = await this.userDAO.register(firstName, lastName, alias, password, imageUrl);
    // const user = userObj.dto;
    // const authToken = await this.sessionDAO.createSession(alias);

    return [response.user, response.authToken];
  }

  // Get user by alias
  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    const session = await this.sessionDAO.getSession(token);
    if (!session) {
      throw new Error("Invalid or expired session token");
    }

    return await this.userDAO.getUserByAlias(alias);
  }

  // Follow a user
  public async follow(token: string, userToFollow: UserDto): Promise<[number, number]> {
    const session = await this.sessionDAO.getSession(token);
    if (!session) {
      throw new Error("Invalid or expired session token");
    }

    await this.followDAO.follow(session.alias, userToFollow.alias);

    const followerCount = await this.userDAO.getFollowerCount(userToFollow.alias);
    const followeeCount = await this.userDAO.getFolloweeCount(session.alias);

    return [followerCount, followeeCount];
  }

  // Unfollow a user
  public async unfollow(token: string, userToUnfollow: UserDto): Promise<[number, number]> {
    const session = await this.sessionDAO.getSession(token);
    if (!session) {
      throw new Error("Invalid or expired session token");
    }

    await this.followDAO.unfollow(session.alias, userToUnfollow.alias);

    const followerCount = await this.userDAO.getFollowerCount(userToUnfollow.alias);
    const followeeCount = await this.userDAO.getFolloweeCount(session.alias);

    return [followerCount, followeeCount];
  }

  // Check if a user is following another user
  public async getIsFollowerStatus(token: string, user: UserDto | null, selectedUser: UserDto | null): Promise<boolean> {
    if (!user || !selectedUser) {
      return false;
    }

    const session = await this.sessionDAO.getSession(token);
    if (!session) {
      throw new Error("Invalid or expired session token");
    }

    return await this.userDAO.getIsFollowerStatus(user.alias, selectedUser.alias);
  }

  // Get the number of users a user is following
  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    const session = await this.sessionDAO.getSession(token);
    if (!session) {
      throw new Error("Invalid or expired session token");
    }

    return await this.userDAO.getFolloweeCount(user.alias);
  }

  // Get the number of followers a user has
  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    const session = await this.sessionDAO.getSession(token);
    if (!session) {
      throw new Error("Invalid or expired session token");
    }

    return await this.userDAO.getFollowerCount(user.alias);
  }
}
