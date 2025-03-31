import { LoginRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: LoginRequest): Promise<TweeterResponse> => {
    const userService = new UserService();
    await userService.login(request.alias, request.password);
    return {
        success: true,
        message: null
    }
}