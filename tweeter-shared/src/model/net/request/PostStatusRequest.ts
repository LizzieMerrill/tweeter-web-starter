import { StatusDto } from "../../dto/StatusDto";
import { TweeterRequest } from "./TweeterRequest";

//poststatus

export interface PostStatusRequest extends TweeterRequest{
    readonly token: string,
    readonly newStatus: StatusDto
}

