import { AuthToken, Status, User } from 'tweeter-shared';
import { StatusService } from '../model/StatusService';
import { MessageView, Presenter } from './Presenter';

export interface PostStatusView extends MessageView{
    onPostSuccess: () => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView>{
    private _statusService: StatusService | null = null;
    public constructor(view: PostStatusView) {
      super(view);  
    }

    public get statusService(){
      if (this._statusService == null){
        this._statusService = new StatusService();
      }
      return this._statusService;
    }

    public async submitPost(authToken: AuthToken, postText: string, currentUser: User): Promise<void> {
      await this.doFailureReportingOperation(async () => {
        if (!authToken || !currentUser || !postText.trim()) {
          this.view.displayErrorMessage("Invalid status or user authentication.");
          return;
        }
  
        this.view.displayInfoMessage("Posting status...", 0);
  
        const status = new Status(postText, currentUser, Date.now());
  
        await this.statusService.postStatus(authToken, status);
  
        this.view.displayInfoMessage("Status posted!", 2000);
        this.view.onPostSuccess();
    }, "post the status", () => this.view.clearLastInfoMessage()); //finally callback  
  };
}