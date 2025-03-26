import { StatusDto } from "../../dto/StatusDto";

//poststatus

export interface PostStatusRequest{
    readonly token: string,
    readonly newStatus: StatusDto | null
}

