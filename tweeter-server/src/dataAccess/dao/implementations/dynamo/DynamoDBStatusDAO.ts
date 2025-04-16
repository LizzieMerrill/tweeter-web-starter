import * as AWS from "aws-sdk";
import { IStatusDAO } from "../../interfaces/IStatusDAO";
import { StatusDto } from "tweeter-shared";
import * as dotenv from 'dotenv';
dotenv.config();

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
const STATUSES_TABLE = process.env.STATUSES_TABLE || "statuses";
const FEEDS_TABLE = process.env.FEEDS_TABLE || "feeds";
const FOLLOWS_TABLE = process.env.FOLLOWS_TABLE || "follows";
const BATCH_WRITE_LIMIT = 25;

export class DynamoDBStatusDAO implements IStatusDAO {
  async loadStory(
    userAlias: string,
    pageSize: number,
    lastItem?: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: STATUSES_TABLE,
      KeyConditionExpression: "userAlias = :alias",
      ExpressionAttributeValues: { ":alias": userAlias },
      Limit: pageSize,
      ScanIndexForward: false
    };

    if (lastItem && lastItem.timestamp) {
      params.ExclusiveStartKey = {
        userAlias,
        timestamp: lastItem.timestamp
      };
    }

    const result = await docClient.query(params).promise();
    const items = (result.Items || []) as StatusDto[];
    const hasMore = !!result.LastEvaluatedKey;
    return [items, hasMore];
  }

  async loadFeed(
    userAlias: string,
    pageSize: number,
    lastItem?: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: FEEDS_TABLE,
      KeyConditionExpression: "receiverAlias = :alias",
      ExpressionAttributeValues: { ":alias": userAlias },
      Limit: pageSize,
      ScanIndexForward: false
    };

    if (lastItem && lastItem.timestamp) {
      params.ExclusiveStartKey = {
        receiverAlias: userAlias,
        statusTimestamp: lastItem.timestamp
      };
    }

    const result = await docClient.query(params).promise();
    const items = (result.Items || []) as StatusDto[];
    const hasMore = !!result.LastEvaluatedKey;
    return [items, hasMore];
  }

  async postStatus(newStatus: StatusDto): Promise<void> {
    // 1) Insert new status into STATUSES_TABLE.
    const putParams = {
      TableName: STATUSES_TABLE,
      Item: {
        userAlias: newStatus.user.alias,
        timestamp: newStatus.timestamp,
        statusText: newStatus.post
      }
    };
    await docClient.put(putParams).promise();

    // 2) Retrieve all followers for the posting user.
    const followerParams: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: FOLLOWS_TABLE,
      KeyConditionExpression: "followeeAlias = :ua",
      ExpressionAttributeValues: { ":ua": newStatus.user.alias }
    };
    const followerResult = await docClient.query(followerParams).promise();
    const followers = followerResult.Items || [];
    if (!followers.length) return;

    // 3) Fan-out: Prepare feed items for each follower.
    const feedWriteRequests: AWS.DynamoDB.DocumentClient.WriteRequests = [];
    for (const f of followers) {
      const followerAlias = (f as any).followerAlias;
      const feedItem = {
        PutRequest: {
          Item: {
            receiverAlias: followerAlias,
            statusTimestamp: newStatus.timestamp,
            senderAlias: newStatus.user.alias,
            statusText: newStatus.post
          }
        }
      };
      feedWriteRequests.push(feedItem);
      if (feedWriteRequests.length === BATCH_WRITE_LIMIT) {
        await this.batchWriteFeeds(feedWriteRequests);
        feedWriteRequests.length = 0;
      }
    }
    if (feedWriteRequests.length > 0) {
      await this.batchWriteFeeds(feedWriteRequests);
    }
  }

  // BatchWrite with retry for unprocessed items.
  private async batchWriteFeeds(
    requests: AWS.DynamoDB.DocumentClient.WriteRequests
  ): Promise<void> {
    let unprocessed = requests;
    do {
      const params = {
        RequestItems: {
          [FEEDS_TABLE]: unprocessed
        }
      };
      const result = await docClient.batchWrite(params).promise();
      unprocessed = (result.UnprocessedItems && result.UnprocessedItems[FEEDS_TABLE]) || [];
      if (unprocessed.length > 0) {
        // Wait a bit before retrying.
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } while (unprocessed.length > 0);
  }
}
