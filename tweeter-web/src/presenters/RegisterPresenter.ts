import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/UserService";
import { AuthPresenter, AuthView } from "./AuthPresenter";
import { Buffer } from "buffer";

export interface RegisterView{

}

export class RegisterPresenter extends AuthPresenter {
    private userService: UserService;
    public imageUrl = <string>("");
    public imageBytes = <Uint8Array>(new Uint8Array());
    public imageFileExtension = <string>("");
    public constructor(view: AuthView) {
        super(view);
        this.userService = new UserService();
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