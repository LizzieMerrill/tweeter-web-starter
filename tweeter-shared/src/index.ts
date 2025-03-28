//domain classes
export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";

// All classes that should be avaialble to other modules need to exported here. export * does not work when 
// uploading to lambda. Instead we have to list each export.
export { FakeData } from "./util/FakeData";

//export DTO's
export type { UserDto } from "./model/dto/UserDto";
export type { FollowDto } from "./model/dto/FollowDto";
export type { StatusDto } from "./model/dto/StatusDto";

//export requests
export type { CheckIfFollowerRequest } from "./model/net/request/CheckIfFollowerRequest";
export type { GetFollowCountsRequest } from "./model/net/request/GetFollowCountsRequest";
export type { GetUserRequest } from "./model/net/request/GetUserRequest";
export type { LoginRequest } from "./model/net/request/LoginRequest";
export type { LogoutRequest } from "./model/net/request/LogoutRequest";
export type { PagedStatusItemRequest } from "./model/net/request/PagedStatusItemRequest";
export type { PagedUserItemRequest } from "./model/net/request/PagedUserItemRequest";
export type { PostStatusRequest } from "./model/net/request/PostStatusRequest";
export type { RegisterRequest } from "./model/net/request/RegisterRequest";
export type { ToggleFollowingRequest } from "./model/net/request/ToggleFollowingRequest";

//export responses
export type { TweeterResponse } from "./model/net/response/TweeterResponse";
export type { PagedUserItemResponse } from "./model/net/response/PagedUserItemResponse";
export type { PagedStatusItemResponse } from "./model/net/response/PagedStatusItemResponse";
export type { GetUserResponse } from "./model/net/response/GetUserResponse";
export type { GetFollowCountsResponse } from "./model/net/response/GetFollowCountsResponse";
export type { CheckIfFollowerResponse } from "./model/net/response/CheckIfFollowerResponse";