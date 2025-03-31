import { UserDto } from "../../dto/UserDto";

//follow and unfollow

export interface ToggleFollowingRequest{
    readonly token: string,
    readonly userToFollowOrUnfollow: UserDto
}
