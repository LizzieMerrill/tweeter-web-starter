import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBDAOFactory } from "../../dataAccess/dao/factory/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();

export const handler = async (request: LogoutRequest): Promise<TweeterResponse> => {
  const userService = new UserService(daoFactory.getUserDAO(), daoFactory.getS3DAO(), daoFactory.getFollowDAO(), daoFactory.getSessionDAO());
  await userService.logout(request.token);

  return {
    success: true,
    message: undefined
  };
};
