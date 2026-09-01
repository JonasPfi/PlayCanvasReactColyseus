import { Client, Room } from "@colyseus/sdk";

// detect if we're running on localhost
const endpoint = (window.location.href.indexOf("localhost") >= 0 || window.location.href.indexOf("127.0.0.1") >= 0)
  ? "http://localhost:2567"
  : "https://" + window.location.hostname;

const client = new Client(endpoint);
let room: Room | null = null;

export type NetworkStatus = "idle" | "connecting" | "connected" | "reconnecting" | "disconnected" | "error";
let status: NetworkStatus = "idle";
let lastError: string | null = null;

type RoomListener = (room: Room | null) => void;
type StatusListener = (status: NetworkStatus, error: string | null) => void;
const roomListeners = new Set<RoomListener>();
const statusListeners = new Set<StatusListener>();

function setRoom(next: Room | null) {
  room = next;
  roomListeners.forEach((l) => l(room));
}

function setStatus(next: NetworkStatus, error: string | null = null) {
  status = next;
  lastError = error;
  statusListeners.forEach((l) => l(status, lastError));
}

function attachRoomHandlers(activeRoom: Room) {
  activeRoom.onDrop(() => setStatus("reconnecting"));
  activeRoom.onReconnect(() => setStatus("connected"));

  activeRoom.onError((code, message) => {
    console.error(`Room error (${code}):`, message);
  });

  activeRoom.onLeave((code) => {
    setRoom(null);
    setStatus("disconnected", `left with code ${code}`);
  });
}

async function join(roomName: string) {
  if (room) return room;

  setStatus("connecting");
  try {
    const joined = await client.joinOrCreate(roomName);
    attachRoomHandlers(joined);
    setRoom(joined);
    setStatus("connected");
    return joined;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    setStatus("error", message);
    throw err;
  }
}

async function leave() {
  if (!room) return;
  try {
    await room.leave();
  } catch (err) {
    console.error("Error while leaving room:", err);
    setRoom(null);
    setStatus("idle");
  }
}

function onRoomChange(listener: RoomListener) {
  listener(room);
  roomListeners.add(listener);
  return () => {
    roomListeners.delete(listener);
  }
}

function onStatusChange(listener: StatusListener) {
  listener(status, lastError);
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  }
}

export default {
  client: client,
  join,
  leave,
  onRoomChange,
  onStatusChange,
  get room() {
    return room;
  },
  get status() {
    return status;
  },
}
