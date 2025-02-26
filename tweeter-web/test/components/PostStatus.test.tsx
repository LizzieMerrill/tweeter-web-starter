import PostStatus from "../../src/components/postStatus/PostStatus.tsx";
import {instance, mock, verify} from "@typestrong/ts-mockito";
import { PostStatusPresenter, PostStatusView } from "../../src/presenters/PostStatusPresenter.ts";
import {render, screen} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { AuthToken, User } from "tweeter-shared";

describe("PostStatus Component", () => {

    const authToken = new AuthToken("abc123", Date.now());
    const userObj = new User("l", "l", "l", "l");

    it("When first rendered the Post Status and Clear buttons are both disabled", () => {
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);
        
        const {postStatusButton, clearButton} = renderPostStatusAndGetElements(mockPresenterInstance);
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });
    it("Both buttons are enabled when the text field has text", async () => {
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);
        
        const {postStatusButton, clearButton, user, textField} = renderPostStatusAndGetElements(mockPresenterInstance);

        await user.type(textField, "lolz");
        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
    });
    it("Both buttons are disabled when the text field is cleared", async () => {
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);
        
        const {postStatusButton, clearButton, user, textField} = renderPostStatusAndGetElements(mockPresenterInstance);

        await user.clear(textField);
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });
    it("The presenter's submitPost method is called with correct parameters when the Post Status button is pressed", async () => {
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);
        
        const {postStatusButton, clearButton, user, textField} = renderPostStatusAndGetElements(mockPresenterInstance);
        const text = "lolz";

        await user.type(textField, text);

        await user.click(postStatusButton);
        await mockPresenter.submitPost(authToken, text, userObj);//????
        verify(mockPresenter.submitPost(authToken, text, userObj)).once();
    });
});

const renderPostStatus = ( presenter?: PostStatusPresenter) => {
        return render(
        <MemoryRouter>
            {!!presenter ? (<PostStatus presenter={presenter} presenterGenerator={function (view: PostStatusView): PostStatusPresenter {
                            throw new Error("PresenterGenerator not needed for tests?")}}/>) : (<PostStatus presenterGenerator={function (view: PostStatusView): PostStatusPresenter {
                                            throw new Error("PresenterGenerator not needed for tests?")}}/>)}
        </MemoryRouter>);
}

const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
    const user = userEvent.setup();
    
    renderPostStatus(presenter);
    const postStatusButton = screen.getByRole("button", {name: /post status/i});
    const clearButton = screen.getByRole("button", {name: /clear/i});
    const textField = screen.getByLabelText("text");

    return {postStatusButton, clearButton, textField, user};
}