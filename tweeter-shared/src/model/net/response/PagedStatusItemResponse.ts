import { StatusDto } from "../../dto/StatusDto";
import { TweeterResponse } from "./TweeterResponse";

//getfeed and getstory

export interface PagedStatusItemResponse extends TweeterResponse{
    readonly items: StatusDto[] | null;
    readonly hasMore: boolean;
}