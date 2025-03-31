import { UserDto } from "../../dto/UserDto";

//getfollowercount and getfolloweecount

export interface GetFollowCountsRequest{
    readonly token: string,
    readonly user: UserDto
}
