import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { gameBridge } from '../core/GameBridge';
import Network from '../core/Network';
import { gameStore } from '../core/GameStore';
import { useRoom } from '../contexts/NetworkContext';
import { Callbacks } from "@colyseus/sdk";

export function SceneUI() {
  const { logout } = useAuth();
  const room = useRoom();
  const [count, setCount] = useState(0);

  async function joinRoom() {
    await Network.join("chunk");
  }

  function incrementCount(){
    room?.send("increment");
  }

  useEffect(() => {
    if(!room) return;
    const callbacks = Callbacks.get(room);
    const unsub = callbacks.listen("myCount", (value) => setCount(value));
    return () => unsub();
  }, [room]);

  useEffect(() => {
    const handleGameEvent = () => {
      gameStore.setState({ test: gameStore.getState().test + 1 });
      console.log('UI got game event. Event count:', gameStore.getState().test);
    };
    gameBridge.addEventListener('game:event', handleGameEvent);

    return () => {
      gameBridge.removeEventListener('game:event', handleGameEvent);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <button
        onClick={logout}
        className="pointer-events-auto absolute top-4 right-4 rounded-lg bg-slate-900/80 px-4 py-2 text-white backdrop-blur hover:bg-slate-800"
      >
        Sign out
      </button>
      <button
        onClick={joinRoom}
        className="pointer-events-auto absolute top-15 right-4 rounded-lg bg-slate-900/80 px-4 py-2 text-white backdrop-blur hover:bg-slate-800"
      >
        Join Room
      </button>
      <button
        onClick={() => gameBridge.emitToGame('ui:event')}
        className="pointer-events-auto absolute top-26 right-4 rounded-lg bg-slate-900/80 px-4 py-2 text-white backdrop-blur hover:bg-slate-800"
      >
        Trigger UI event
      </button>
      <button
        onClick={incrementCount}
        className="pointer-events-auto absolute top-37 right-4 rounded-lg bg-slate-900/80 px-4 py-2 text-white backdrop-blur hover:bg-slate-800"
      >
        Increment Count
      </button>
      <div className="pointer-events-none absolute top-4 left-4 text-white">
        Count: {count}
      </div>
    </div>
  );
}
