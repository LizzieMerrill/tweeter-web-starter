import { User } from "tweeter-shared";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";
import { FollowService } from "../model/FollowService";

//originally extended View
export interface UserItemView extends PagedItemView<User>{
    addItems: (newItems: User[]) => void;
}

export abstract class UserItemPresenter extends PagedItemPresenter<User, FollowService> {
    protected createService(): FollowService{
        return new FollowService();
    }
}
