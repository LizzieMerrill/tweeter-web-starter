import * as AWS from "aws-sdk";
import { ISessionDAO } from "../../interfaces/ISessionDAO";
import * as dotenv from 'dotenv';
dotenv.config();

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
const AUTH_TOKENS_TABLE = process.env.AUTH_TOKENS_TABLE || "auth_tokens";

export class DynamoDBSessionDAO implements ISessionDAO {
  async createSession(
    token: string,
    alias: string,
    expiresAt: number,
    lastActivity: number
  ): Promise<void> {
    const params = {
      TableName: AUTH_TOKENS_TABLE,
      Item: {
        token,
        alias,
        expiresAt,
        lastActivity
      },
      ConditionExpression: "attribute_not_exists(token)"
    };
    await docClient.put(params).promise();
  }

  async getSession(token: string): Promise<{ token: string; alias: string; expiresAt: number; lastActivity: number } | null> {
    const params = {
      TableName: AUTH_TOKENS_TABLE,
      Key: { token }
    };
    const result = await docClient.get(params).promise();
    return result.Item ? (result.Item as any) : null;
  }

  async updateSessionActivity(token: string, lastActivity: number, newExpiresAt?: number): Promise<void> {
    let updateExpression = "set lastActivity = :la";
    const expressionAttributeValues: any = { ":la": lastActivity };
    if (newExpiresAt) {
      updateExpression += ", expiresAt = :ea";
      expressionAttributeValues[":ea"] = newExpiresAt;
    }
    const params = {
      TableName: AUTH_TOKENS_TABLE,
      Key: { token },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues
    };
    await docClient.update(params).promise();
  }

  async deleteSession(token: string): Promise<void> {
    const params = {
      TableName: AUTH_TOKENS_TABLE,
      Key: { token }
    };
    await docClient.delete(params).promise();
  }
}
