import { createContext, useContext, useEffect, useState } from "react";
import Network from "../core/Network";
import type { Room } from "@colyseus/sdk";

const NetworkContext = createContext<Room | null>(null);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [room, setRoom] = useState<Room | null>(Network.room);

  useEffect(() => Network.onRoomChange(setRoom), []);

  return (
    <NetworkContext.Provider value={room}>{children}</NetworkContext.Provider>
  );
}

export function useRoom() {
  return useContext(NetworkContext);
}
