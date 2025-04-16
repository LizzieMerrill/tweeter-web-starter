import { IUserDAO } from "./IUserDAO";
import { IStatusDAO } from "./IStatusDAO";
import { IFollowDAO } from "./IFollowDAO";
import { IS3DAO } from "./IS3DAO";
import { ISessionDAO } from "./ISessionDAO";

export interface IDAOFactory {
  getUserDAO(): IUserDAO;
  getStatusDAO(): IStatusDAO;
  getFollowDAO(): IFollowDAO;
  getS3DAO(): IS3DAO;
  getSessionDAO(): ISessionDAO;
}
