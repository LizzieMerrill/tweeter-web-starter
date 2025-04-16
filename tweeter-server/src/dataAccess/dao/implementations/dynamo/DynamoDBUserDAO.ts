import * as AWS from "aws-sdk";
import * as bcrypt from "bcryptjs";
import { IUserDAO } from "../../interfaces/IUserDAO";
import { UserDto, AuthToken } from "tweeter-shared";

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
const USERS_TABLE = process.env.USERS_TABLE || "users";
const FOLLOWS_TABLE = process.env.FOLLOWS_TABLE || "follows";

export class DynamoDBUserDAO implements IUserDAO {
  async getUserByAlias(alias: string): Promise<UserDto | null> {
    const params = {
      TableName: USERS_TABLE,
      Key: { alias }
    };
    const result = await docClient.get(params).promise();
    return result.Item ? (result.Item as UserDto) : null;
  }

  async login(alias: string, password: string): Promise<{ user: UserDto; authToken: AuthToken }> {
    const user = await this.getUserByAlias(alias);
    if (!user) {
      throw new Error("User not found or invalid alias");
    }
    const storedHash = (user as any).hashedPassword;
    if (!storedHash) {
      throw new Error("Password not set for this user");
    }
    const valid = await bcrypt.compare(password, storedHash);
    if (!valid) {
      throw new Error("Invalid password");
    }
    const authToken = AuthToken.Generate();
    return { user, authToken };
  }

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageUrl: string
  ): Promise<{ user: UserDto; authToken: AuthToken }> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      alias,
      firstName,
      lastName,
      hashedPassword, //stored for password verification
      imageUrl: userImageUrl, //mapped as needed
      createdAt: new Date().toISOString(),
      followerCount: 0,
      followeeCount: 0
    };

    const params = {
      TableName: USERS_TABLE,
      Item: newUser,
      ConditionExpression: "attribute_not_exists(alias)"
    };

    await docClient.put(params).promise();

    const authToken = AuthToken.Generate();
    //exclude hashedPassword from the returned user object
    const { hashedPassword: _, ...userDto } = newUser;
    return { user: userDto as UserDto, authToken };
  }

  async updateFollowCounts(alias: string, followerCount: number, followeeCount: number): Promise<void> {
    const params = {
      TableName: USERS_TABLE,
      Key: { alias },
      UpdateExpression: "set followerCount = :fc, followeeCount = :fe",
      ExpressionAttributeValues: {
        ":fc": followerCount,
        ":fe": followeeCount
      }
    };
    await docClient.update(params).promise();
  }

  async getIsFollowerStatus(userAlias: string, selectedUserAlias: string): Promise<boolean> {
    const params = {
      TableName: FOLLOWS_TABLE,
      Key: {
        followerAlias: userAlias,
        followeeAlias: selectedUserAlias
      }
    };
    const result = await docClient.get(params).promise();
    return !!result.Item;
  }

  //verify using bcrypt
  async verifyPassword(user: UserDto, password: string): Promise<boolean> {
    const storedHash = (user as any).hashedPassword;
    if (!storedHash) {
      throw new Error("User's password hash not available");
    }
    return await bcrypt.compare(password, storedHash);
  }

  async getFollowerCount(alias: string): Promise<number> {
    const user = await this.getUserByAlias(alias);
    if (!user) {
      throw new Error("User not found");
    }
    return (user as any).followerCount || 0;
  }

  async getFolloweeCount(alias: string): Promise<number> {
    const user = await this.getUserByAlias(alias);
    if (!user) {
      throw new Error("User not found");
    }
    return (user as any).followeeCount || 0;
  }
}
