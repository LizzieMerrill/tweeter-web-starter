import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
    const statusService = new StatusService();
    const [lastItem, hasMore] = await statusService.loadMoreStoryItems(request.token, request.userAlias, request.pageSize, request.lastItem);

    return{
        success: true,
        message: null,
        lastItem: lastItem,
        hasMore: hasMore
    }
}