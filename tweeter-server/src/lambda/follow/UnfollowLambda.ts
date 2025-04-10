import { ToggleFollowingRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: ToggleFollowingRequest): Promise<TweeterResponse> => {
    const userService = new UserService();
    await userService.unfollow(request.token, request.userToFollowOrUnfollow);
    return {
        success: true,
        message: undefined
    }
}