import { CheckIfFollowerRequest, CheckIfFollowerResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: CheckIfFollowerRequest): Promise<CheckIfFollowerResponse> => {
    const userService = new UserService();
}