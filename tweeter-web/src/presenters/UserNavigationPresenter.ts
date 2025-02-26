import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View{
    setDisplayedUser: (user: User) => void;
    authToken: AuthToken | null;
    currentUser: User | null;
}
export class UserNavigationPresenter extends Presenter<UserNavigationView>{
    private userService: UserService;
    public constructor(view: UserNavigationView) {
        super(view);
        this.userService = new UserService();
    }

    public async getUser (
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        return this.userService.getUser(authToken, alias);
    };

    public async navigateToUser (event: React.MouseEvent): Promise<void> {
        event.preventDefault();

        const { authToken, currentUser } = this.view;

        this.doFailureReportingOperation(async () => {
          const alias = this.extractAlias(event.target.toString());
    
          const user = await this.getUser(authToken!, alias);
    
          if (!!user) {
            if (currentUser!.equals(user)) {
              this.view.setDisplayedUser(currentUser!);
            } else {
              this.view.setDisplayedUser(user);
            }
          }
        }, "get user");
      };

  public extractAlias (value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  };
}
