import assert from "assert";
import { ColyseusTestServer, boot } from "@colyseus/testing";
import appConfig from "../src/app.config.js";
import { ChunkState } from "../src/rooms/schema/ChunkState.js";

describe("testing your Colyseus app", () => {
  let colyseus: ColyseusTestServer<typeof appConfig>;

  before(async () => {
    colyseus = await boot(appConfig);
  });

  after(async () => {
    await colyseus.shutdown();
  });

  beforeEach(async () => await colyseus.cleanup());

  it("connecting into a room", async () => {
    const room = await colyseus.createRoom<ChunkState>("chunk", {});
    const client1 = await colyseus.connectTo(room);
    assert.strictEqual(client1.sessionId, room.clients[0].sessionId);
  });
});
