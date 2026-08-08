import assert from "assert";
import { ColyseusTestServer, boot } from "@colyseus/testing";

// import your "app.config.ts" file here.
import appConfig from "../src/app.config.js";

describe("Testing the authentication service", () => {
  let colyseus: ColyseusTestServer<typeof appConfig>;

  before(async () => colyseus = await boot(appConfig));
  after(async () => colyseus.shutdown());

  beforeEach(async () => await colyseus.cleanup());

  it("register new account", async () => {
    const response = await colyseus.http.post("/auth/register", {
      body: { email: "test@test.com", password: "secret" }
    });
    // make your assertions

  });
});
