import { StatusDto } from "../../dto/StatusDto";

//getfeed and getstory

export interface PagedStatusItemRequest{
    readonly token: string,
    readonly userAlias: string,
    readonly pageSize: number,
    readonly lastItem: StatusDto | null
}

