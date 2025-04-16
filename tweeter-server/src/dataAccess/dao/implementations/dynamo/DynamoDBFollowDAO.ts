import * as AWS from "aws-sdk";
import { IFollowDAO } from "../../interfaces/IFollowDAO";
import { UserDto } from "tweeter-shared";

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
const FOLLOWERS_TABLE = process.env.FOLLOWERS_TABLE || "followers";
const FOLLOWEES_TABLE = process.env.FOLLOWEES_TABLE || "followees";
const USERS_TABLE = process.env.USERS_TABLE || "users";

export class DynamoDBFollowDAO implements IFollowDAO {
  async getFollowers(
    userAlias: string,
    pageSize: number,
    lastItem?: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: FOLLOWERS_TABLE,
      KeyConditionExpression: "followeeAlias = :alias",
      ExpressionAttributeValues: { ":alias": userAlias },
      Limit: pageSize
    };

    if (lastItem && lastItem.alias) {
      params.ExclusiveStartKey = {
        followeeAlias: userAlias,
        followerAlias: lastItem.alias
      };
    }

    const result = await docClient.query(params).promise();
    const records = (result.Items || []) as any[];
    const [converted, hasMore] = await this.convertAliasesToUserDtos(records, "followerAlias", result.LastEvaluatedKey);
    return [converted, hasMore];
  }

  async getFollowees(
    userAlias: string,
    pageSize: number,
    lastItem?: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: FOLLOWEES_TABLE,
      KeyConditionExpression: "followerAlias = :alias",
      ExpressionAttributeValues: { ":alias": userAlias },
      Limit: pageSize
    };

    if (lastItem && lastItem.alias) {
      params.ExclusiveStartKey = {
        followerAlias: userAlias,
        followeeAlias: lastItem.alias
      };
    }

    const result = await docClient.query(params).promise();
    const records = (result.Items || []) as any[];
    const [converted, hasMore] = await this.convertAliasesToUserDtos(records, "followeeAlias", result.LastEvaluatedKey);
    return [converted, hasMore];
  }

  async follow(followerAlias: string, followeeAlias: string): Promise<void> {
    const putFollowees = {
      TableName: FOLLOWEES_TABLE,
      Item: { followerAlias, followeeAlias },
      ConditionExpression: "attribute_not_exists(followerAlias) AND attribute_not_exists(followeeAlias)"
    };
    const putFollowers = {
      TableName: FOLLOWERS_TABLE,
      Item: { followeeAlias, followerAlias },
      ConditionExpression: "attribute_not_exists(followeeAlias) AND attribute_not_exists(followerAlias)"
    };
    await Promise.all([
      docClient.put(putFollowees).promise(),
      docClient.put(putFollowers).promise()
    ]);
  }

  async unfollow(followerAlias: string, followeeAlias: string): Promise<void> {
    const delFollowees = { TableName: FOLLOWEES_TABLE, Key: { followerAlias, followeeAlias } };
    const delFollowers = { TableName: FOLLOWERS_TABLE, Key: { followeeAlias, followerAlias } };
    await Promise.all([
      docClient.delete(delFollowees).promise(),
      docClient.delete(delFollowers).promise()
    ]);
  }

  private async convertAliasesToUserDtos(
    records: any[],
    aliasField: string,
    lastEvaluatedKey: AWS.DynamoDB.DocumentClient.Key | undefined
  ): Promise<[UserDto[], boolean]> {
    if (records.length === 0) {
      return [[], !!lastEvaluatedKey];
    }
    const aliases = records.map((r) => r[aliasField]);
    const uniqueAliases = Array.from(new Set(aliases));
    const batchParams = {
      RequestItems: {
        [USERS_TABLE]: {
          Keys: uniqueAliases.map((alias) => ({ alias }))
        }
      }
    };
    const response = await docClient.batchGet(batchParams).promise();
    const userItems = response.Responses ? response.Responses[USERS_TABLE] : [];
    const userMap: { [alias: string]: UserDto } = {};
    for (const u of userItems || []) {
      userMap[(u as UserDto).alias] = u as UserDto;
    }
    const userDtos: UserDto[] = [];
    for (const record of records) {
      const aliasVal = record[aliasField];
      if (userMap[aliasVal]) {
        userDtos.push(userMap[aliasVal]);
      }
    }
    return [userDtos, !!lastEvaluatedKey];
  }
}
