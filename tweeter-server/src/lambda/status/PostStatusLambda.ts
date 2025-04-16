import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDBDAOFactory } from "../../dataAccess/dao/factory/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
  const statusService = new StatusService(daoFactory.getStatusDAO());
  await statusService.postStatus(request.token, request.newStatus);

  return {
    success: true,
    message: undefined
  };
};
