import { getApi } from "../../src/scripts/main";

describe("api test", () => {
  it("pass api adress correct", () => {
    const response = getApi(
      "https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300"
    );
    expect(response.status).toBe(200);
  });
});
