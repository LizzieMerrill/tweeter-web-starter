import { UserDto } from "../../dto/UserDto";

//getfollowees and getfollowers

export interface PagedUserItemRequest{
    readonly token: string,
    readonly userAlias: string,
    readonly pageSize: number,
    readonly lastItem: UserDto | null
}