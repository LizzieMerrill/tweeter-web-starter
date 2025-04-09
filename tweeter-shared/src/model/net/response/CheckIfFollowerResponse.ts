import { TweeterResponse } from "./TweeterResponse";

//getisfollowerstatus

export interface CheckIfFollowerResponse extends TweeterResponse{
    readonly follower: boolean;
}