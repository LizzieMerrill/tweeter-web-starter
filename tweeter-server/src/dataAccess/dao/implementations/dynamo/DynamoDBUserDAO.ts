// src/dataAccess/dao/implementations/dynamo/DynamoDBUserDAO.ts
import * as AWS from "aws-sdk";
import * as bcrypt from "bcryptjs";
import { IUserDAO } from "../../interfaces/IUserDAO";
import { UserDto, AuthToken } from "tweeter-shared";

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
const USERS_TABLE = process.env.USERS_TABLE || "users";
// For this implementation we use the followees table to check if a user is following another:
const FOLLOWEES_TABLE = process.env.FOLLOWEES_TABLE || "followees";

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
      hashedPassword, // stored for password verification
      imageUrl: userImageUrl, // mapped as needed in your domain
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
    // Exclude hashedPassword from the returned user object
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

  // Implement getIsFollowerStatus by checking if the user (userAlias) follows the selected user (selectedUserAlias)
  async getIsFollowerStatus(userAlias: string, selectedUserAlias: string): Promise<boolean> {
    // Using the followees table: if userAlias is following selectedUserAlias, an item should exist.
    const params = {
      TableName: FOLLOWEES_TABLE,
      Key: {
        followerAlias: userAlias,
        followeeAlias: selectedUserAlias
      }
    };
    const result = await docClient.get(params).promise();
    return !!result.Item;
  }

  // Verify a password using bcrypt
  async verifyPassword(user: UserDto, password: string): Promise<boolean> {
    const storedHash = (user as any).hashedPassword;
    if (!storedHash) {
      throw new Error("User's password hash not available");
    }
    return await bcrypt.compare(password, storedHash);
  }

  // Get follower count from the user record
  async getFollowerCount(alias: string): Promise<number> {
    const user = await this.getUserByAlias(alias);
    if (!user) {
      throw new Error("User not found");
    }
    return (user as any).followerCount || 0;
  }

  // Get followee count from the user record
  async getFolloweeCount(alias: string): Promise<number> {
    const user = await this.getUserByAlias(alias);
    if (!user) {
      throw new Error("User not found");
    }
    return (user as any).followeeCount || 0;
  }
}
