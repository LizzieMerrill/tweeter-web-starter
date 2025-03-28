import { TweeterResponse } from "./TweeterResponse";

//getfollowercount and getfolloweecount

export interface GetFollowCountsResponse extends TweeterResponse{
    readonly count: number | null;
}