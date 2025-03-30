import { GetFollowCountsRequest, GetFollowCountsResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: GetFollowCountsRequest): Promise<GetFollowCountsResponse> => {
    const userService = new UserService();
}