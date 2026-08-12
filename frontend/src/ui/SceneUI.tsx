import { useAuth } from '../contexts/AuthContext';

export function SceneUI() {
  const { logout } = useAuth();

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <button
        onClick={logout}
        className="pointer-events-auto absolute top-4 right-4 rounded-lg bg-slate-900/80 px-4 py-2 text-white backdrop-blur hover:bg-slate-800"
      >
        Sign out
      </button>
    </div>
  );
}
