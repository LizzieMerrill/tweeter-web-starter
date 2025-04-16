import { GetFollowCountsRequest, GetFollowCountsResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBDAOFactory } from "../../dataAccess/dao/factory/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();

export const handler = async (request: GetFollowCountsRequest): Promise<GetFollowCountsResponse> => {
  const userService = new UserService(daoFactory.getUserDAO(), daoFactory.getS3DAO(), daoFactory.getFollowDAO(), daoFactory.getSessionDAO());
  const count = await userService.getFolloweeCount(request.token, request.user);

  return {
    success: true,
    message: undefined,
    count: count
  };
};
