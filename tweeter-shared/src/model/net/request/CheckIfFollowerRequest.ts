import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

//getisfollowerstatus

export interface CheckIfFollowerRequest extends TweeterRequest{
    readonly token: string,
    readonly user: UserDto | null,
    readonly selectedUser: UserDto | null
}
