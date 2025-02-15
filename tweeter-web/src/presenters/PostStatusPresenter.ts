import { AuthToken, Status } from 'tweeter-shared';
import { StatusService } from '../model/StatusService';

export const PAGE_SIZE = 10;

export interface PostStatusView{
    displayErrorMessage: (message: string) => void;
}

export class PostStatusPresenter {
    private statusService: StatusService;
    public constructor(view: PostStatusView) {
        this.statusService = new StatusService();
    }
    public async postStatus(
        authToken: AuthToken,
        newStatus: Status
    ): Promise<void> {        
          // TODO: Call the server to post the status
          this.statusService.postStatus(authToken, newStatus);
    };
}