import { Status } from "tweeter-shared";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";
import { StatusService } from "../model/StatusService";

//originally extended View
export interface StatusItemView extends PagedItemView<Status>{
    addItems: (newItems: Status[]) => void;
}

export abstract class StatusItemPresenter extends PagedItemPresenter<Status, StatusService>{
    protected createService(): StatusService{
        return new StatusService();
    }
}
