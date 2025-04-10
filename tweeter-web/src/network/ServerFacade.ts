import {
  AuthResponse,
  AuthToken,
  CheckIfFollowerRequest,
  CheckIfFollowerResponse,
  GetFollowCountsRequest,
  GetFollowCountsResponse,
  GetUserRequest,
  GetUserResponse,
  LoginRequest,
  LogoutRequest,
  PagedStatusItemRequest,
    PagedStatusItemResponse,
    PagedUserItemRequest,
    PagedUserItemResponse,
    PostStatusRequest,
    RegisterRequest,
    Status,
    ToggleFollowingRequest,
    TweeterResponse,
    User,
    UserDto
  } from "tweeter-shared";
  import { ClientCommunicator } from "./ClientCommunicator";
  
  export class ServerFacade {
    private SERVER_URL = "https://o6feotpo30.execute-api.us-east-1.amazonaws.com/dev/";
  
    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);
  


    //getMoreFollowees
    public async getMoreFollowees(
      request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedUserItemRequest,
        PagedUserItemResponse
      >(request, "/followee/list");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: User[] | null =
        response.success && response.items
          ? response.items.map((dto) => User.fromDto(dto) as User)
          : null;
  
      // Handle errors    
      if (response.success) {
        if (items == null) {
          throw new Error(`No followees found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message!);
      }
    }



    //getMoreFollowers
    public async getMoreFollowers(
      request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedUserItemRequest,
        PagedUserItemResponse
      >(request, "/follower/list");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: User[] | null =
        response.success && response.items
          ? response.items.map((dto) => User.fromDto(dto) as User)
          : null;
  
      // Handle errors    
      if (response.success) {
        if (items == null) {
          throw new Error(`No followers found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message!);
      }
    }



    //getStoryItems
    public async getStoryItems(
      request: PagedStatusItemRequest
    ): Promise<[Status, boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedStatusItemRequest,
        PagedStatusItemResponse
      >(request, "/user/getStoryItems");
  
      // Convert the StatusDto returned by ClientCommunicator to a SStatus
      const lastItem: Status | null =
        response.success && response.lastItem
          ? Status.fromDto(response.lastItem) : null;
  
      // Handle errors    
      if (response.success) {
        if (lastItem == null) {
          throw new Error(`No story items found`);
        } else {
          return [lastItem, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message!);
      }
    }



        //getFeedItems
        public async getFeedItems(
          request: PagedStatusItemRequest
        ): Promise<[Status, boolean]> {
          const response = await this.clientCommunicator.doPost<
            PagedStatusItemRequest,
            PagedStatusItemResponse
          >(request, "/user/getFeedItems");
      
      // Convert the StatusDto returned by ClientCommunicator to a SStatus
      const lastItem: Status | null =
        response.success && response.lastItem
          ? Status.fromDto(response.lastItem) : null;
      
          // Handle errors    
          if (response.success) {
            if (lastItem == null) {
              throw new Error(`No feed items found`);
            } else {
              return [lastItem, response.hasMore];
            }
          } else {
            console.error(response);
            throw new Error(response.message!);
          }
        }





      //login
      public async login(
        request: LoginRequest
      ): Promise<[UserDto, AuthToken]> {
        const response = await this.clientCommunicator.doPost<
          LoginRequest,
          AuthResponse
        >(request, "/auth/login");

        // Handle errors    
        if (response.success) {
          const userDto = response.userDto;
          const authToken = response.authToken;
          return [userDto, authToken];
        } else {
          console.error(response);
          throw new Error(response.message!);
        }
      }


      //logout
      public async logout(
        request: LogoutRequest
      ): Promise<void> {
        const response = await this.clientCommunicator.doPost<
          LogoutRequest,
          TweeterResponse
        >(request, "/auth/logout");
        
        // Handle errors    
        if (response.success) {
          //?
        } else {
          console.error(response);
          throw new Error(response.message!);
        }
      }




      //register
      public async register(
        request: RegisterRequest
      ): Promise<[UserDto, AuthToken]> {
        const response = await this.clientCommunicator.doPost<
          RegisterRequest,
          AuthResponse
        >(request, "/auth/register");
        
        // Handle errors    
        if (response.success) {
          const userDto = response.userDto;
          const authToken = response.authToken;
          return [userDto, authToken];
        } else {
          console.error(response);
          throw new Error(response.message!);
        }
      }




      //checkIfFollowing
      public async checkIfFollowing(
        request: CheckIfFollowerRequest
      ): Promise<boolean> {
        const response = await this.clientCommunicator.doPost<
          CheckIfFollowerRequest,
          CheckIfFollowerResponse
        >(request, "/follow/checkIfFollowing");
        
        // Handle errors    
        if (response.success) {
          return response.follower;
        } else {
          console.error(response);
          throw new Error(response.message!);
        }
      }



      //follow
      public async follow(
        request: ToggleFollowingRequest
      ): Promise<void> {
        const response = await this.clientCommunicator.doPost<
          ToggleFollowingRequest,
          TweeterResponse
        >(request, "/follow/follow");
        
        // Handle errors    
        if (response.success) {
          //?
        } else {
          console.error(response);
          throw new Error(response.message!);
        }
      }




      //unfollow
      public async unfollow(
        request: ToggleFollowingRequest
      ): Promise<void> {
        const response = await this.clientCommunicator.doPost<
          ToggleFollowingRequest,
          TweeterResponse
        >(request, "/follow/unfollow");
        
        // Handle errors    
        if (response.success) {
          //?
        } else {
          console.error(response);
          throw new Error(response.message!);
        }
      }




      //getFolloweeCount
      public async getFolloweeCount(
        request: GetFollowCountsRequest
      ): Promise<number> {
        const response = await this.clientCommunicator.doPost<
          GetFollowCountsRequest,
          GetFollowCountsResponse
        >(request, "/followee/count");
        
        // Handle errors    
        if (response.success) {
          return response.count;
        } else {
          console.error(response);
          throw new Error(response.message!);
        }
      }



      //getFollowerCount
      public async getFollowerCount(
        request: GetFollowCountsRequest
      ): Promise<number> {
        const response = await this.clientCommunicator.doPost<
          GetFollowCountsRequest,
          GetFollowCountsResponse
        >(request, "/follower/count");
        
        // Handle errors    
        if (response.success) {
          return response.count;
        } else {
          console.error(response);
          throw new Error(response.message!);
        }
      }


      //getUser
      public async getUser(
        request: GetUserRequest
      ): Promise<User> {
        const response = await this.clientCommunicator.doPost<
          GetUserRequest,
          GetUserResponse
        >(request, "/user/getUser");


      // Convert the UserDto returned by ClientCommunicator to a User
      // const userObj = response.success && response.user
      //     ? User.fromDto(response.user) as User : null;

            const userObj = User.fromDto(response.user) as User;
        
        // Handle errors    
        if (response.success) {
          return userObj;
        } else {
          console.error(response);
          throw new Error(response.message!);
        }
      }

      //postStatus
      public async postStatus(
        request: PostStatusRequest
      ): Promise<void> {
        const response = await this.clientCommunicator.doPost<
          PostStatusRequest,
          TweeterResponse
        >(request, "/user/postStatus");

        // Handle errors    
        if (response.success) {
          //?
        } else {
          console.error(response);
          throw new Error(response.message!);
        }
      }
  }