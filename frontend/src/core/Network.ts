import { Client, Room } from "@colyseus/sdk";

// detect if we're running on localhost
const endpoint = (window.location.href.indexOf("localhost") >= 0 || window.location.href.indexOf("127.0.0.1") >= 0)
  ? "http://localhost:2567"
  : "https://" + window.location.hostname;

const client = new Client(endpoint);

const rooms = new Map<string, Room>();

export type NetworkStatus = "idle" | "connecting" | "connected" | "reconnecting" | "disconnected" | "error";
type StatusEntry = { status: NetworkStatus; error: string | null };
const roomStatus = new Map<string, StatusEntry>();

type RoomsListener = (rooms: Map<string, Room>) => void;
type StatusListener = (key: string, entry: StatusEntry) => void;
const roomsListeners = new Set<RoomsListener>();
const statusListeners = new Set<StatusListener>();

function notifyRooms() {
  roomsListeners.forEach((l) => l(rooms));
}

function setStatus(key: string, status: NetworkStatus, error: string | null = null) {
  const entry = { status, error };
  roomStatus.set(key, entry);
  statusListeners.forEach((l) => l(key, entry));
}

function attachRoomHandlers(key: string, activeRoom: Room) {
  activeRoom.onDrop(() => setStatus(key, "reconnecting"));
  activeRoom.onReconnect(() => setStatus(key, "connected"));

  activeRoom.onError((code, message) => {
    console.error(`Room "${key}" error (${code}):`, message);
  });

  activeRoom.onLeave((code) => {
    rooms.delete(key);
    notifyRooms();
    setStatus(key, "disconnected", `left with code ${code}`);
  });
}

async function join(roomName: string, options?: Record<string, unknown>, key: string = roomName): Promise<Room> {
  const existing = rooms.get(key);
  if (existing) return existing; //Only allow one connection per room type

  setStatus(key, "connecting");
  try {
    const joined = await client.joinOrCreate(roomName, options);
    attachRoomHandlers(key, joined);
    rooms.set(key, joined);
    notifyRooms();
    setStatus(key, "connected");
    return joined;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    setStatus(key, "error", message);
    throw err;
  }
}

async function leave(key: string) {
  const activeRoom = rooms.get(key);
  if (!activeRoom) return;
  try {
    await activeRoom.leave();
  } catch (err) {
    console.error(`Error while leaving room "${key}":`, err);
    rooms.delete(key);
    notifyRooms();
    setStatus(key, "idle");
  }
}

function leaveAll() {
  return Promise.all(Array.from(rooms.keys()).map((key) => leave(key)));
}

function onRoomsChange(listener: RoomsListener) {
  listener(rooms);
  roomsListeners.add(listener);
  return () => {
    roomsListeners.delete(listener);
  }
}

function onStatusChange(listener: StatusListener) {
  roomStatus.forEach((entry, key) => listener(key, entry));
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  }
}

export default {
  client: client,
  join,
  leave,
  leaveAll,
  onRoomsChange,
  onStatusChange,
  getRoom(key: string) {
    return rooms.get(key) ?? null;
  },
  getStatus(key: string): StatusEntry {
    return roomStatus.get(key) ?? { status: "idle", error: null };
  },
}
