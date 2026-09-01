import { Room, Client, CloseCode, AuthContext, ServerError, JWT } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState.js";

export class MyRoom extends Room {
  maxClients = 4;
  state = new MyRoomState();

  messages = {
    increment: (client: Client) => {
      this.state.myCount++;
      console.log(client.sessionId, "incremented the counter");
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

  onDrop(client: Client, code: CloseCode) {
    /**
     * Called on an unexpected disconnect (e.g. brief network loss, tab
     * backgrounded).
     */
    console.log(client.sessionId, "dropped, allowing reconnection...", code);
    this.allowReconnection(client, 20);
  }

  onReconnect(client: Client) {
    /**
     * Called when a dropped client reconnects successfully.
     */
    console.log(client.sessionId, "reconnected!");
  }

  onDispose() {
    /**
     * Called when the room is disposed.
     */
    console.log("room", this.roomId, "disposing...");
  }

}
