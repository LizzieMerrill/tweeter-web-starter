import { AuthToken } from "tweeter-shared";
import { AppNavbarPresenter, AppNavbarView } from "../../src/presenters/AppNavbarPresenter";
import {anything, instance, mock, spy, verify, when} from "@typestrong/ts-mockito";
import { UserService } from "../../src/model/UserService";

describe("AppNavbarPresenter", () => {
    let mockAppNavbarView: AppNavbarView;
    let appNavbarPresenter: AppNavbarPresenter;
    let mockUserService: UserService;
    const authToken = new AuthToken("abc123", Date.now());

    beforeEach(() => {
        mockAppNavbarView = mock<AppNavbarView>();
        const mockAppNavbarViewInstance = instance(mockAppNavbarView);
        const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarViewInstance));
        appNavbarPresenter = instance(appNavbarPresenterSpy);

        mockUserService = mock<UserService>();
        const mockUserServiceInstance = instance(mockUserService);
        when(appNavbarPresenterSpy.userService).thenReturn(mockUserServiceInstance);
    });
    
    it("tells the view to display a logging out message", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0)).once();//counter-test with never()
    });
    it("calls service logout with proper authtoken", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockUserService.logout(authToken)).once();//counter test with anything() in place of authtoken
    });
    it("clears info message and user info on successful logout", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarView.clearLastInfoMessage()).once();
        verify(mockAppNavbarView.clearUserInfo()).once();
        verify(mockAppNavbarView.displayErrorMessage(anything())).never();
        //verify(mockAppNavbarView.navigateToLogin).once(); from demo but not needed
    });
    it("error message when logout fails, dont clear anything", async () => {
        const error = new Error("An error occurred");
        when(mockUserService.logout(authToken)).thenThrow(error);

        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarView.displayErrorMessage("Failed to log user out because of exception: An error occurred")).once();

        verify(mockAppNavbarView.clearLastInfoMessage()).never();
        verify(mockAppNavbarView.clearUserInfo()).never();
    });
});