import { CheckIfFollowerRequest, CheckIfFollowerResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: CheckIfFollowerRequest): Promise<CheckIfFollowerResponse> => {
    const userService = new UserService();
    const follower = await userService.getIsFollowerStatus(request.token, request.user, request.selectedUser);
    return{
        success: true,
        message: undefined,
        follower: follower
    }
}