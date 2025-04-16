import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDBDAOFactory } from "../../dataAccess/dao/factory/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  const followService = new FollowService(daoFactory.getFollowDAO());
  const [items, hasMore] = await followService.loadMoreFollowers(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );

  return {
    success: true,
    message: undefined,
    items,
    hasMore
  };
};
