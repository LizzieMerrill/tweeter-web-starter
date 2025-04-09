import "isomorphic-fetch";
import { User } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import { GetFollowCountsRequest, GetFollowCountsResponse } from "tweeter-shared";

describe("ServerFacade Integration Test - GetFollowerCount", () => {
  let serverFacade: ServerFacade;

  beforeEach(() => {
    serverFacade = new ServerFacade();
  });

  it("should successfully return the follower count", async () => {
    const request: GetFollowCountsRequest = { 
        token: "lol",
        user: new User("firstName",
            "lastName",
            "alias",
            "imageUrl").dto
    };

    //dummy response to simulate a successful follower count retrieval
    const dummyResponse: GetFollowCountsResponse = {
      success: true,
      message: null,
      count: 5,
    };

    //override the internal doPost method to return the dummy response
    const originalDoPost = (serverFacade as any).clientCommunicator.doPost;
    (serverFacade as any).clientCommunicator.doPost = jest.fn().mockResolvedValue(dummyResponse);

    const count = await serverFacade.getFollowerCount(request);
    expect(count).toBe(5);

    //ensure correct endpoint was called
    expect((serverFacade as any).clientCommunicator.doPost).toHaveBeenCalledWith(
      request,
      "/follower/count"
    );

    (serverFacade as any).clientCommunicator.doPost = originalDoPost;
  });
});
