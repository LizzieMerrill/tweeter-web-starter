import { AuthToken, Status, User } from "tweeter-shared";
import {PostStatusPresenter, PostStatusView} from "../../src/presenters/PostStatusPresenter.ts";
import {anything, instance, mock, spy, verify, when} from "@typestrong/ts-mockito";
import { StatusService } from "../../src/model/StatusService.ts";

describe("PostStatusPresenter", () => {
    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockStatusService: StatusService;
    const authToken = new AuthToken("abc123", Date.now());
    const user = new User("l", "l", "l", "l");
    const status = new Status("my epic status", user, Date.now());

    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);
        const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
        postStatusPresenter = instance(postStatusPresenterSpy);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService);
        when(postStatusPresenterSpy.statusService).thenReturn(mockStatusServiceInstance);
    });
    
    it("tells the view to display a posting status message", async () => {
        await postStatusPresenter.submitPost(authToken, "my epic post", user);
        verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();//counter-test with never()
    });
    it("calls service poststatus with proper string and authtoken", async () => {
        await postStatusPresenter.submitPost(authToken, "my epic post", user);
        verify(mockStatusService.postStatus(authToken, status)).once();//counter test with anything() in place of authtoken
    });
    it("clears info message, clear post and displays status posted message on successful postStatus", async () => {
        await postStatusPresenter.submitPost(authToken, "my epic post", user);
        verify(mockPostStatusView.clearLastInfoMessage).once();
        verify(mockPostStatusView.onPostSuccess).once();//onPostSuccess clears post
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();

        verify(mockPostStatusView.displayErrorMessage(anything())).never();
    });
    it("error message when poststatus fails, clear last info message but nothing else", async () => {
        const error = new Error("An error occurred");
        when(mockStatusService.postStatus(authToken, status)).thenThrow(error);

        await postStatusPresenter.submitPost(authToken, "my epic post", user)
        verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: An error occurred")).once();

        verify(mockPostStatusView.clearLastInfoMessage()).once();
        
        verify(mockPostStatusView.onPostSuccess).never();//onPostSuccess clears post
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
    });
});