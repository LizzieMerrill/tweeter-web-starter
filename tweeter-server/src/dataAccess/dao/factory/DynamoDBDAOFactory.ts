import { IDAOFactory } from "../interfaces/IDAOFactory";
import { IUserDAO } from "../interfaces/IUserDAO";
import { IStatusDAO } from "../interfaces/IStatusDAO";
import { IFollowDAO } from "../interfaces/IFollowDAO";
import { IS3DAO } from "../interfaces/IS3DAO";
import { ISessionDAO } from "../interfaces/ISessionDAO";

import { DynamoDBUserDAO } from "../implementations/dynamo/DynamoDBUserDAO";
import { DynamoDBStatusDAO } from "../implementations/dynamo/DynamoDBStatusDAO";
import { DynamoDBFollowDAO } from "../implementations/dynamo/DynamoDBFollowDAO";
import { DynamoDBSessionDAO } from "../implementations/dynamo/DynamoDBSessionDAO";
import { S3DAO } from "../implementations/s3/S3DAO";

export class DynamoDBDAOFactory implements IDAOFactory {
  private userDAO: IUserDAO = new DynamoDBUserDAO();
  private statusDAO: IStatusDAO = new DynamoDBStatusDAO();
  private followDAO: IFollowDAO = new DynamoDBFollowDAO();
  private s3DAO: IS3DAO = new S3DAO();
  private sessionDAO: ISessionDAO = new DynamoDBSessionDAO();

  getUserDAO(): IUserDAO { return this.userDAO; }
  getStatusDAO(): IStatusDAO { return this.statusDAO; }
  getFollowDAO(): IFollowDAO { return this.followDAO; }
  getS3DAO(): IS3DAO { return this.s3DAO; }
  getSessionDAO(): ISessionDAO { return this.sessionDAO; }
}
