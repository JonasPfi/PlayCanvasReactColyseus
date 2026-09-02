# PlayCanvas + React + Colyseus Starter

A full-stack starter template for building real-time multiplayer 3D games/experiences with
[PlayCanvas](https://playcanvas.com/) (via [`@playcanvas/react`](https://developer.playcanvas.com/user-manual/react/)),
[React](https://react.dev/), and [Colyseus](https://colyseus.io/) for authoritative multiplayer state sync.

![logo](https://github.com/JonasPfi/PlayCanvasReactColyseus/blob/main/image.png)

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
`http://localhost:2567` when running on `localhost`/`127.0.0.1` (see `frontend/src/core/colyseus.ts`).

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

- **`frontend/src/core/colyseus.ts`** — The single, room-type-agnostic Colyseus `Client`
  instance. Every room connection (auth, the game room, any future room type) shares this
  client.
- **`frontend/src/rooms/gameRoom.ts`** — Binds [`@colyseus/react`](https://github.com/colyseus/react-tools)'s
  `createRoomContext<MyRoomState>()` to the `"myroom"` room type, exporting `GameRoomProvider`,
  `useGameRoom`, and `useGameRoomState`. Connection lifecycle (connect, cleanup on unmount,
  StrictMode-safety) is handled by the library.
  - **Adding another room type** (chat, lobby, party, ...): add a new file next to this one that
    calls `createRoomContext<YourState>()` (or `createLobbyContext<Metadata>()` for a
    [lobby room](https://docs.colyseus.io/getting-started/react#uselobbyroomcallback-deps)) and export its own Provider/hooks.
    Room types are independent of each other and of `colyseus.ts`.
  - **Dynamically joining an unknown number of rooms** (e.g. spectating several matches at once):
    don't add a context for this. Call the standalone `useRoom()` / `useRoomState()` hooks from
    `@colyseus/react` directly inside the component that needs it — one hook call per room
    instance, each with its own independent connection. See the comment at the bottom of
    `gameRoom.ts` for an example.
- **`frontend/src/App.tsx`** — Wraps the app in `GameRoomProvider`. The connection is deferred
  (`connect={null}`) until the user triggers a join (see the "Join Room" button in `SceneUI.tsx`),
  demonstrating conditional/opt-in connections.
- **`frontend/src/contexts/AuthContext.tsx`** — Wraps `@colyseus/auth`'s client SDK
  (`client.auth`, from `core/colyseus.ts`) and gates routes based on sign-in state.
- **`frontend/src/core/GameBridge.ts`** / **`GameStore.ts`** — Decouple the PlayCanvas scene
  from the React UI layer via a shared `EventTarget` and a minimal observable store, instead of
  prop-drilling or tight coupling.
- **`backend/server/src/rooms/MyRoom.ts`** — Example Colyseus room with JWT auth (`onAuth`),
  reconnection support (`onDrop` / `onReconnect`), and a synchronized counter (`MyRoomState`).

### A note on shared types

`gameRoom.ts` imports `MyRoomState` directly from `backend/server/src/rooms/schema/MyRoomState.ts`
as a **type-only** import (erased at build time, no runtime dependency on the backend). This keeps
frontend and backend state types in sync without a code-generation step, but it does mean
`backend/server` needs its `node_modules` installed for the frontend's `tsc`/`vite build` to
resolve the type — relevant if you ever build the frontend in an environment that only checks out
`frontend/`. For a larger project, consider moving shared schema into its own workspace package
instead.

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
- `useGameRoom()` exposes `isConnecting` / `error`, but no fine-grained `"reconnecting"` state
  during a drop/reconnect cycle (unlike a hand-rolled connection manager might). Listen to
  `room.onDrop` / `room.onReconnect` directly if you need to surface that in the UI.

## Further reading

- [PlayCanvas React manual](https://developer.playcanvas.com/user-manual/react/)
- [Colyseus documentation](https://docs.colyseus.io/)
- [@colyseus/react hooks](https://github.com/colyseus/react-tools)
- [React documentation](https://react.dev/)
- [Vite documentation](https://vite.dev/)
