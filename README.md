# PlayCanvas + React + Colyseus Starter

A full-stack starter template for building real-time multiplayer 3D games/experiences with
[PlayCanvas](https://playcanvas.com/) (via [`@playcanvas/react`](https://developer.playcanvas.com/user-manual/react/)),
[React](https://react.dev/), and [Colyseus](https://colyseus.io/) for authoritative multiplayer state sync.

## Monorepo structure

```
.
├── frontend/   # Vite + React 19 + PlayCanvas React + Tailwind 4
└── backend/
    └── server/ # Colyseus 0.17 + Express
```

## Prerequisites

- Node.js 22.23.2+ (frontend) / 20.9+ (backend) — use the higher requirement (22.23.2+) for both
- npm

## Getting started

Clone the repo, then set up each package separately (they are not npm workspaces, so
`npm install` must be run in each folder):

```bash
# 1. Backend
cd backend/server
cp .env.example .env   # then fill in real secrets, see below
npm install
npm start               # runs on http://localhost:2567

# 2. Frontend (in a second terminal)
cd frontend
npm install
npm run dev              # runs on http://localhost:5173
```

Open <http://localhost:5173> in your browser. The frontend automatically connects to
`http://localhost:2567` when running on `localhost`/`127.0.0.1` (see `frontend/src/core/Network.ts`).

## Environment variables (backend)

Copy `backend/server/.env.example` to `backend/server/.env` and replace the placeholder values:

| Variable         | Description                                      |
| ---------------- | ------------------------------------------------- |
| `URL`             | Public backend URL, used by `@colyseus/auth`       |
| `AUTH_SALT`       | Salt used by the auth module                       |
| `JWT_SECRET`      | Secret used to sign/verify JWTs                    |
| `SESSION_SECRET`  | Secret used for session handling                    |

**Never commit real secrets.** The example values are placeholders only.

## Architecture

- **`frontend/src/core/Network.ts`** — Framework-agnostic Colyseus client singleton. Tracks
  joined rooms and connection status (`idle | connecting | connected | reconnecting | disconnected | error`)
  outside of React state.
- **`frontend/src/contexts/NetworkContext.tsx`** — Exposes `Network.ts`'s state to React via
  `useRoom(key)` / `useNetworkStatus(key)` hooks.
- **`frontend/src/contexts/AuthContext.tsx`** — Wraps `@colyseus/auth`'s client SDK and gates
  routes based on sign-in state.
- **`frontend/src/core/GameBridge.ts`** / **`GameStore.ts`** — Decouple the PlayCanvas scene
  from the React UI layer via a shared `EventTarget` and a minimal observable store, instead of
  prop-drilling or tight coupling.
- **`backend/server/src/rooms/MyRoom.ts`** — Example Colyseus room with JWT auth (`onAuth`),
  reconnection support (`onDrop` / `onReconnect`), and a synchronized counter (`MyRoomState`).

## Known limitations

This is a **starter template**, not production-ready as-is:

- `backend/server/src/config/auth.ts` uses an in-memory `fakeDatabase` array with **plaintext
  passwords** and no persistence. Replace with a real database and password hashing before
  shipping anything real.
- The Colyseus monitor panel (`/monitor`) is mounted without password protection. See the
  [Colyseus monitor docs](https://docs.colyseus.io/tools/monitoring/#restrict-access-to-the-panel-using-a-password)
  before deploying.
- `MyRoom`'s example message handler (`increment`) has no rate limiting or validation — add
  server-side checks for any real game logic.


## Further reading

- [PlayCanvas React manual](https://developer.playcanvas.com/user-manual/react/)
- [Colyseus documentation](https://docs.colyseus.io/)
- [React documentation](https://react.dev/)
- [Vite documentation](https://vite.dev/)
