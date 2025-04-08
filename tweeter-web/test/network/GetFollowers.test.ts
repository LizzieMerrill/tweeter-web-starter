import "isomorphic-fetch";
import { ServerFacade } from "../../../network/ServerFacade";
import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";

describe("ServerFacade Integration Test - GetFollowers", () => {
  let serverFacade: ServerFacade;

  beforeEach(() => {
    serverFacade = new ServerFacade();
  });

  it("should successfully return the followers list with the hasMore flag", async () => {
    const request: PagedUserItemRequest = {
        token: "lol",
        userAlias: "testUser",
        pageSize: 10,
        lastItem: null,
    };

    //dummy follower DTO returned by the server
    const dummyUserDto = {
      alias: "follower1",
      firstName: "Follower",
      lastName: "One",
      imageUrl: "http://example.com/f1.png",
    };

    const dummyResponse: PagedUserItemResponse = {
      success: true,
      message: null,
      items: [dummyUserDto],
      hasMore: false,
    };

    //override the internal doPost method
    const originalDoPost = (serverFacade as any).clientCommunicator.doPost;
    (serverFacade as any).clientCommunicator.doPost = jest.fn().mockResolvedValue(dummyResponse);

    const [users, hasMore] = await serverFacade.getMoreFollowers(request);

    //validate that the followers list is returned and converted properly
    expect(users).toBeDefined();
    expect(users.length).toBe(1);
    expect(hasMore).toBe(false);

    //verify the request was made to the correct endpoint
    expect((serverFacade as any).clientCommunicator.doPost).toHaveBeenCalledWith(
      request,
      "/follower/list"
    );

    (serverFacade as any).clientCommunicator.doPost = originalDoPost;
  });
});
