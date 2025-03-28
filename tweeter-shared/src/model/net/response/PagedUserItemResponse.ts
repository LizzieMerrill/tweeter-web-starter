import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

//getfollowees and getfollowers

export interface PagedUserItemResponse extends TweeterResponse{
    readonly items: UserDto | null;
    readonly hasMore: boolean;
}