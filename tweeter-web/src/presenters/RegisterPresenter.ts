import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/UserService";
import { Buffer } from "buffer";

export interface RegisterView{
    displayErrorMessage: (message: string) => void;
    updateUserInfo: (user: User, authUser: User, token: AuthToken, rememberMe: boolean) => void;
    navigate: (path: string) => void;
    getFirstName: () => string;
    getLastName: () => string;
    getAlias: () => string;
    getPassword: () => string;
    getRememberMe: () => boolean;
    setLoading: (isLoading: boolean) => void;
}

//export class RegisterPresenter extends AuthPresenter {
export class RegisterPresenter {
    private userService: UserService;
    public imageUrl = <string>("");
    public imageBytes = <Uint8Array>(new Uint8Array());
    public imageFileExtension = <string>("");
    private view: RegisterView;
    public constructor(view: RegisterView) {
        this.userService = new UserService();
        this.view = view;
    }

    public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {
        return this.userService.register(firstName, lastName, alias, password, userImageBytes, imageFileExtension);
    };

  public async doRegister () {
    try {
      this.view.setLoading(true);

      const firstName = this.view.getFirstName();
      const lastName = this.view.getLastName();
      const alias = this.view.getAlias();
      const password = this.view.getPassword();
      const rememberMe = this.view.getRememberMe();

      const [user, authToken] = await this.register(
        firstName,
        lastName,
        alias,
        password,
        this.imageBytes,
        this.imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      this.view.setLoading(false);
    }
  };

  public handleImageFile (file: File | undefined) {
    if (file) {
      this.imageUrl = URL.createObjectURL(file);

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.imageBytes = bytes;
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.imageFileExtension = fileExtension;
      }
    } else {
      this.imageUrl = "";
      this.imageBytes = new Uint8Array();
    }
  };

  public getFileExtension (file: File): string | undefined {
    return file.name.split(".").pop();
  };
}