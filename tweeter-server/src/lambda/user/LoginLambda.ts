import { LoginRequest, AuthResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBDAOFactory } from "../../dataAccess/dao/factory/DynamoDBDAOFactory";

const daoFactory = new DynamoDBDAOFactory();

export const handler = async (request: LoginRequest): Promise<AuthResponse> => {
  const userService = new UserService(daoFactory.getUserDAO(), daoFactory.getS3DAO(), daoFactory.getFollowDAO(), daoFactory.getSessionDAO());
  const [userDto, authToken] = await userService.login(request.alias, request.password);

  return {
    success: true,
    message: undefined,
    userDto: userDto,
    authToken: authToken
  };
};
