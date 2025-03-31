import { RegisterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: RegisterRequest): Promise<TweeterResponse> => {
    const userService = new UserService();
    await userService.register(request.firstName, request.lastName, request.alias, request.password, request.userImageBytes, request.imageFileExtension);
    return {
        success: true,
        message: null
    }
}