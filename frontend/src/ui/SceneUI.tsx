import { useAuth } from '../contexts/AuthContext';
import { gameBridge } from '../core/GameBridge';
import Network from '../core/Network';

export function SceneUI() {
  const { logout } = useAuth();
  async function joinRoom() {
    await Network.join("chunk");
  }

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
        className="pointer-events-auto absolute top-25 right-4 rounded-lg bg-slate-900/80 px-4 py-2 text-white backdrop-blur hover:bg-slate-800"
      >
        Trigger UI event
      </button>

    </div>
  );
}
