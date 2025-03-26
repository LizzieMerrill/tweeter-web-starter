import { UserDto } from "../../dto/UserDto";

//getisfollowerstatus

export interface CheckIfFollowerRequest{
    readonly token: string,
    readonly user: UserDto | null,
    readonly selectedUser: UserDto | null
}
