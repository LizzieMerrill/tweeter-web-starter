import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
    const userService = new UserService();
}