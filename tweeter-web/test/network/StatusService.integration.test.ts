import "isomorphic-fetch";
import { StatusService } from "../../model/StatusService";
import { AuthToken, Status } from "tweeter-shared";

describe("StatusService Integration Test - Story Retrieval", () => {
  let statusService: StatusService;
  let authToken: AuthToken;

  beforeEach(() => {
    statusService = new StatusService();
    authToken = new AuthToken("dummy-auth-token", Date.now());
  });

  it("should successfully retrieve a page of story statuses", async () => {
    //arrange: set up parameters for the call
    const userAlias = "testUser";
    const pageSize = 3;
    const lastItem: Status | null = null; //starting with the first page

    //act: call loadMoreStoryItems. This uses the FakeData singleton under the hood
    const [statuses, hasMore] = await statusService.loadMoreStoryItems(authToken, userAlias, pageSize, lastItem);

    //assert: verify that a valid array of statuses is returned along with a boolean hasMore flag
    expect(statuses).toBeDefined();
    expect(Array.isArray(statuses)).toBe(true);
    expect(statuses.length).toBeLessThanOrEqual(pageSize);
    
    //check that each returned item appears to be a Status
    statuses.forEach((status) => {
      //assuming that a Status includes at least a "post" property
      expect(status).toHaveProperty("post");
    });

    //verify that the hasMore flag is a boolean
    expect(typeof hasMore).toBe("boolean");
  });
});
