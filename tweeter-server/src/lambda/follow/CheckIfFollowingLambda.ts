import { CheckIfFollowerRequest, CheckIfFollowerResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBDAOFactory } from "../../dataAccess/dao/factory/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();

export const handler = async (request: CheckIfFollowerRequest): Promise<CheckIfFollowerResponse> => {
  const userService = new UserService(daoFactory.getUserDAO(), daoFactory.getS3DAO(), daoFactory.getFollowDAO(), daoFactory.getSessionDAO());
  const follower = await userService.getIsFollowerStatus(request.token, request.user, request.selectedUser);

  return {
    success: true,
    message: undefined,
    follower: follower
  };
};
