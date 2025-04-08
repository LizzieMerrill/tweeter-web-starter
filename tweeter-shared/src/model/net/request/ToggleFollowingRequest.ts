import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

//follow and unfollow

export interface ToggleFollowingRequest extends TweeterRequest{
    readonly token: string,
    readonly userToFollowOrUnfollow: UserDto
}
