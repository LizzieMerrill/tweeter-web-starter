import { RegisterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: RegisterRequest): Promise<TweeterResponse> => {
    const userService = new UserService();
}