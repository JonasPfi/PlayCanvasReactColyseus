import { Client, Room } from "@colyseus/sdk";

// detect if we're running on localhost
const endpoint = (window.location.href.indexOf("localhost") >= 0 || window.location.href.indexOf("127.0.0.1") >= 0)
  ? "http://localhost:2567"
  : "https://" + window.location.hostname;

const client = new Client(endpoint);
let room: Room | null = null;

type RoomListener = (room: Room | null) => void;
const listeners = new Set<RoomListener>();

async function join(roomName: string) {
  if (room) return;
  room = await client.joinOrCreate(roomName);
  listeners.forEach((l) => l(room));
}

function leave() {
  room?.leave();
  room = null;
  listeners.forEach((l) => l(room));
}

function onRoomChange(listener: RoomListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  }
}

export default {
  client: client,
  join,
  leave,
  onRoomChange,
  get room() {
    return room;
  },
}
