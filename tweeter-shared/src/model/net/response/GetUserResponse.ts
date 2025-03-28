import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

//getuser

export interface GetUserResponse extends TweeterResponse{
    readonly user: UserDto | null;
}