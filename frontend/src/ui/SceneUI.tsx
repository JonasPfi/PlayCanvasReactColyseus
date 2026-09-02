import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { gameBridge } from '../core/GameBridge';
import { gameStore, useGameStore } from '../core/GameStore';
import { useGameRoom, useGameRoomState } from '../rooms/gameRoom';

type SceneUIProps = {
  onJoinRoom: () => void;
}

export function SceneUI({ onJoinRoom }: SceneUIProps) {
  const { logout } = useAuth();
  const { room } = useGameRoom();
  const count = useGameRoomState((state) => state.myCount);
  const speed = useGameRoomState((state) => state.myRotationSpeed);
  const localCount = useGameStore((state) => state.localCount);

  //For popUp nnotifications
  const [toast, setToast] = useState<string | null>(null);
  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 1000);
  }

  function incrementCount() {
    room?.send("increment");
  }

  function handleJoinRoom() {
    onJoinRoom();
    showToast('Joining room...');
  }

  function sendEventToGame() {
    gameBridge.emitToGame('ui:event');
    showToast("Sending UI event to game");
  }

  useEffect(() => {
    const handleGameEvent = () => {
      gameStore.setState({ localCount: gameStore.getState().localCount + 1 });
      incrementCount();
      showToast('UI got a game event');
    };
    gameBridge.addEventListener('game:event', handleGameEvent);
    return () => {
      gameBridge.removeEventListener('game:event', handleGameEvent);
    };
  }, [room]);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {toast && (
        <div className="pointer-events-none absolute top-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-slate-900/90 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
      <button
        onClick={logout}
        className="pointer-events-auto absolute top-4 right-4 rounded-lg bg-slate-900/80 px-4 py-2 text-white backdrop-blur hover:bg-slate-800"
      >
        Sign out
      </button>
      {!room && (
        <button
          onClick={handleJoinRoom}
          className="pointer-events-auto absolute top-15 right-4 rounded-lg bg-slate-900/80 px-4 py-2 text-white backdrop-blur hover:bg-slate-800"
        >
          Join Room
        </button>
      )}
      <button
        onClick={sendEventToGame}
        className="pointer-events-auto absolute top-26 right-4 rounded-lg bg-slate-900/80 px-4 py-2 text-white backdrop-blur hover:bg-slate-800"
      >
        Trigger UI event
      </button>
      <div className="pointer-events-none absolute top-4 left-4 text-white">
        Event Count: {count ?? 0}
      </div>
      <div className="pointer-events-none absolute top-10 left-4 text-white">
        Local Event Count: {localCount ?? 1}
      </div>
      <div className="pointer-events-none absolute top-16 left-4 text-white">
        Rotation Speed: {speed ?? 1}
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 max-w-xs space-y-1 rounded-lg bg-slate-900/70 p-3 text-xs text-white backdrop-blur">
        <p>A & D: adjust the cube's rotation speed (only once you've joined a room)</p>
        <p>Space: triggers a game event that the UI receives</p>
        <p>Local Event Count: events your browser detected, tracked via the GameStore</p>
        <p>Event Count: total number of events broadcast in your Colyseus room</p>
      </div>
    </div>
  );
}
