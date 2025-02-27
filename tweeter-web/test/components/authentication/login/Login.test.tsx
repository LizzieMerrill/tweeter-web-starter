import Login from "../../../../src/components/authentication/login/Login";
import {instance, mock, verify} from "@typestrong/ts-mockito";
import {render, screen} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { LoginPresenter } from "../../../../src/presenters/LoginPresenter";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fab);

describe("Login Component", () => {
    it("When first rendered the sign-in button is disabled", () => {
        const {signInButton} = renderLoginAndGetElements('/');
        expect(signInButton).toBeDisabled();
    });
    it("The sign-in button is enabled when both the alias and password fields have text", async () => {
        const {signInButton, aliasField, passwordField, user} = renderLoginAndGetElements('/');

        await user.type(aliasField, "lolz");
        await user.type(passwordField, "lolz");
        expect(signInButton).toBeEnabled();
    });
    it("The sign-in button is disabled if either the alias or password field is cleared", async () => {
        const {signInButton, aliasField, passwordField, user} = renderLoginAndGetElements('/');

        await user.type(aliasField, "lolz");
        await user.type(passwordField, "lolz");
        expect(signInButton).toBeEnabled();

        //clears alias
        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();


        await user.type(aliasField, "lolz");
        expect(signInButton).toBeEnabled();

        //clears pass
        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();
    });
    it("presenter's login method is called with correct parameters when the sign-in button is pressed", async () => {
        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInstance = instance(mockPresenter);
        const originalUrl = "http://someurl.com";
        const alias = "@SomeAlias";
        const password = "myPassword";

        const {signInButton, aliasField, passwordField, user} = 
            renderLoginAndGetElements(originalUrl, mockPresenterInstance);

        await user.type(aliasField, alias);
        await user.type(passwordField, password);

        await user.click(signInButton);
        verify(mockPresenter.doLogin(alias, password, originalUrl)).once();
    });
});

const renderLogin = ( originalUrl?: string, presenter?: LoginPresenter) => {
    return render(
    <MemoryRouter>
        {!!presenter ? (<Login originalUrl={originalUrl} presenter={presenter}/>) : 
            (<Login originalUrl={originalUrl}/>)}
    </MemoryRouter>);
}

const renderLoginAndGetElements = ( originalUrl?: string, presenter?: LoginPresenter) => {
    const user = userEvent.setup();
    
    renderLogin( originalUrl, presenter);

    const signInButton = screen.getByRole("button", {name: /Sign in/i});
    const aliasField = screen.getByLabelText("alias");
    const passwordField = screen.getByLabelText("password");

    return {signInButton, aliasField, passwordField, user};
}