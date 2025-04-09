import { TweeterResponse } from "./TweeterResponse";
import { UserDto } from "../../dto/UserDto";
import { AuthToken } from "../../../model/domain/AuthToken";

export interface AuthResponse extends TweeterResponse {
    readonly userDto: UserDto;
    readonly authToken: AuthToken;
}
