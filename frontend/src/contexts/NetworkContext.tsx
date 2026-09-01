import { createContext, useContext, useEffect, useState } from "react";
import Network, { type NetworkStatus } from "../core/Network";
import type { Room } from "@colyseus/sdk";

type StatusEntry = { status: NetworkStatus; error: string | null };

type NetworkContextValue = {
  rooms: Map<string, Room>;
  statuses: Map<string, StatusEntry>;
};

const NetworkContext = createContext<NetworkContextValue>({ rooms: new Map(), statuses: new Map() });

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<Map<string, Room>>(new Map());
  const [statuses, setStatuses] = useState<Map<string, StatusEntry>>(new Map());

  useEffect(() => Network.onRoomsChange((current) => setRooms(new Map(current))), []);
  useEffect(() => Network.onStatusChange((key, entry) => {
    setStatuses((prev) => new Map(prev).set(key, entry));
  }), []);

  return (
    <NetworkContext.Provider value={{ rooms, statuses }}>{children}</NetworkContext.Provider>
  );
}

export function useRoom(key: string) {
  return useContext(NetworkContext).rooms.get(key) ?? null;
}

export function useNetworkStatus(key: string): StatusEntry {
  return useContext(NetworkContext).statuses.get(key) ?? { status: "idle", error: null };
}
