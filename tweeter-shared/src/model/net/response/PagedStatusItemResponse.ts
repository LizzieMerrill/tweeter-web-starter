import { StatusDto } from "../../dto/StatusDto";
import { TweeterResponse } from "./TweeterResponse";

//getfeed and getstory

export interface PagedStatusItemResponse extends TweeterResponse{
    readonly lastItem: StatusDto | null;
    readonly hasMore: boolean;
}