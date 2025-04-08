import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

//getfollowees and getfollowers

export interface PagedUserItemRequest extends TweeterRequest{
    readonly token: string,
    readonly userAlias: string,
    readonly pageSize: number,
    readonly lastItem: UserDto | null
}