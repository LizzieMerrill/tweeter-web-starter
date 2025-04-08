import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

//getfollowercount and getfolloweecount

export interface GetFollowCountsRequest extends TweeterRequest{
    readonly token: string,
    readonly user: UserDto
}
