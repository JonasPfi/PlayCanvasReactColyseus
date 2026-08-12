import { Room, Client, CloseCode, AuthContext, ServerError, JWT } from "colyseus";
import { ChunkState } from "./schema/ChunkState.js";

export class Chunk extends Room {
  maxClients = 4;
  state = new ChunkState();

  messages = {
    yourMessageType: (client: Client, message: any) => {
      /**
       * Handle "yourMessageType" message.
       */
      console.log(client.sessionId, "sent a message:", message);
    }
  }

  static async onAuth(token: string, options: any, context: AuthContext): Promise<unknown> {
    if (!token) {
      throw new ServerError(401, "no token provided");
    }
    try {
      return await JWT.verify(token);
    } catch (e) {
      throw new ServerError(401, "invalid token");
    }
  }

  onCreate(options: any) {
    /**
     * Called when a new room is created.
     */
  }

  onJoin(client: Client, options: any) {
    /**
     * Called when a client joins the room.
     */
    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, code: CloseCode) {
    /**
     * Called when a client leaves the room.
     */
    console.log(client.sessionId, "left!", code);
  }

  onDispose() {
    /**
     * Called when the room is disposed.
     */
    console.log("room", this.roomId, "disposing...");
  }

}
