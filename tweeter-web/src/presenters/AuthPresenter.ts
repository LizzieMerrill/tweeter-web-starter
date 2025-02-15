export interface AuthView{

}
//IMPLEMENT PARENT PRESENTER OF LOGIN AND REGISTER PRESENTERS AND USE IN LOGIN AND REGISTER COMPONENTS?
export abstract class AuthPresenter{
    private _view: AuthView;
    protected constructor(view: AuthView) {
        this._view = view;
    }
    protected get view(){
        return this._view;
    }
}