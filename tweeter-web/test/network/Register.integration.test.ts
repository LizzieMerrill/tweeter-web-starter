import "isomorphic-fetch";
import { ServerFacade } from "../../src/network/ServerFacade";
import { RegisterRequest, TweeterResponse } from "tweeter-shared";

describe("ServerFacade Integration Test - Register", () => {
  let serverFacade: ServerFacade;

  beforeEach(() => {
    serverFacade = new ServerFacade();
  });

  it("should successfully register a user", async () => {
    const request: RegisterRequest = {
      firstName: "Test",
      lastName: "User",
      alias: "testUser",
      password: "password",
      userImageBytes: new Uint8Array(),
      imageFileExtension: ".png"
    };

    //dummy successful response returned by the server
    const dummySuccessResponse: TweeterResponse = { success: true, message: null };

    //temporarily override clientCommunicator.doPost to simulate a server response
    const originalDoPost = (serverFacade as any).clientCommunicator.doPost;
    (serverFacade as any).clientCommunicator.doPost = jest.fn().mockResolvedValue(dummySuccessResponse);

    //call register and verify that no error is thrown
    await expect(serverFacade.register(request)).resolves.not.toThrow();
    
    expect((serverFacade as any).clientCommunicator.doPost).toHaveBeenCalledWith(
      request,
      "/auth/register"
    );

    //restore the original method for cleanup
    (serverFacade as any).clientCommunicator.doPost = originalDoPost;
  });
});
