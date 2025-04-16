import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBDAOFactory } from "../../dataAccess/dao/factory/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
  const userService = new UserService(daoFactory.getUserDAO(), daoFactory.getS3DAO(), daoFactory.getFollowDAO(), daoFactory.getSessionDAO());
  const user = await userService.getUser(request.token, request.alias);

  return {
    success: true,
    message: undefined,
    user: user
  };
};
