export interface AuthView{
    displayErrorMessage: (message: string) => void;
}
//IMPLEMENT PARENT PRESENTER OF LOGIN AND REGISTER PRESENTERS AND USE IN LOGIN AND REGISTER COMPONENTS?
export abstract class AuthPresenter{
    protected _view: AuthView;
    protected constructor(view: AuthView) {
        this._view = view;
    }
    protected get view(){
        return this._view;
    }
}