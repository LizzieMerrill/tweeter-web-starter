import { UserService } from "../model/UserService";
import { Buffer } from "buffer";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export class RegisterPresenter extends AuthPresenter {
    private userService: UserService;
    public imageUrl = <string>("");
    public imageBytes = <Uint8Array>(new Uint8Array());
    public imageFileExtension = <string>("");
    public constructor(view: AuthView) {
      super(view);  
      this.userService = new UserService();
    }

  public async doRegister () {
    await this.doFailureReportingOperation(async () => {
      this.view.setLoading(true);

      this.doAuthenticationOperation(
        (alias, password, firstName?, lastName?, imageBytes?, imageFileExtension?) => 
            this.userService.register(alias, password, firstName!, lastName!, this.imageBytes, this.imageFileExtension),
        "",
        this.imageBytes,
        this.imageFileExtension
    );
  }, "register user", () => this.view.setLoading(false)); //finally callback
  };

  public handleImageFile (file: File | undefined) {
    if (file) {
      this.imageUrl = URL.createObjectURL(file);

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        //remove unnecessary file metadata from the start of the string
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.imageBytes = bytes;
      };
      reader.readAsDataURL(file);

      //set image file extension (and move to a separate method)
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