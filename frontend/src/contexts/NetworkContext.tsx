import { createContext, useContext, useEffect, useState } from "react";
import Network, { type NetworkStatus } from "../core/Network";
import type { Room } from "@colyseus/sdk";

type NetworkContextValue = {
  room: Room | null;
  status: NetworkStatus;
  error: string | null;
};

const NetworkContext = createContext<NetworkContextValue>({ room: null, status: "idle", error: null });

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [room, setRoom] = useState<Room | null>(Network.room);
  const [status, setStatus] = useState<NetworkStatus>(Network.status);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => Network.onRoomChange(setRoom), []);
  useEffect(() => Network.onStatusChange((s, e) => {
    setStatus(s);
    setError(e);
  }), []);

  return (
    <NetworkContext.Provider value={{ room, status, error }}>{children}</NetworkContext.Provider>
  );
}

export function useRoom() {
  return useContext(NetworkContext).room;
}

export function useNetworkStatus() {
  const { status, error } = useContext(NetworkContext);
  return { status, error };
}
