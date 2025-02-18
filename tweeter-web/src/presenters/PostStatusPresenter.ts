import { AuthToken, Status, User } from 'tweeter-shared';
import { StatusService } from '../model/StatusService';

export const PAGE_SIZE = 10;

export interface PostStatusView{
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
    onPostSuccess: () => void;
}

export class PostStatusPresenter {
    private statusService: StatusService;
    private view: PostStatusView;
    public constructor(view: PostStatusView) {
        this.statusService = new StatusService();
        this.view = view;
    }

    public async submitPost(authToken: AuthToken, postText: string, currentUser: User): Promise<void> {
        try {
          if (!authToken || !currentUser || !postText.trim()) {
            this.view.displayErrorMessage("Invalid status or user authentication.");
            return;
          }
    
          this.view.displayInfoMessage("Posting status...", 0);
    
          const status = new Status(postText, currentUser, Date.now());
    
          await this.statusService.postStatus(authToken, status);
    
          this.view.displayInfoMessage("Status posted!", 2000);
          this.view.onPostSuccess();
        } catch (error) {
          this.view.displayErrorMessage(`Failed to post the status: ${error}`);
        } finally {
          this.view.clearLastInfoMessage();
        }
      }
}