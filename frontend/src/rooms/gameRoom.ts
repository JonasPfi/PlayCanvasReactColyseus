import { createRoomContext } from "@colyseus/react";

// Type-only import across the two independent packages; erased at build time.
import type { MyRoomState } from "../../../backend/server/src/rooms/schema/MyRoomState";

// Bound context for the main "myroom" game room. Every room *type* the app
// connects to gets its own createRoomContext() call and its own file here
// (e.g. rooms/chatRoom.ts, rooms/lobbyRoom.ts via createLobbyContext()).
// This keeps room types independent: each has its own connection lifecycle,
// its own Provider, and its own hooks, without touching the shared client.
export const {
  RoomProvider: GameRoomProvider,
  useRoom: useGameRoom,
  useRoomState: useGameRoomState,
} = createRoomContext<MyRoomState>();

// For a dynamic/unbounded number of rooms of the same type (e.g. spectating
// several matches, one room per party), don't add a context here. Use the
// standalone hooks directly where needed instead, one hook call per room
// instance:
//
//   import { useRoom, useRoomState } from "@colyseus/react";
//   import { client } from "../core/colyseus";
//
//   function MatchWatcher({ roomId }: { roomId: string }) {
//     const { room } = useRoom(() => client.joinById(roomId), [roomId]);
//     const state = useRoomState(room);
//     ...
//   }
//
// Each component instance then owns an independent connection, so you can
// render as many as you need (e.g. one per entry in a list).
