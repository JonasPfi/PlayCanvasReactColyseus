# Frontend — PlayCanvas React + Colyseus

The client for the [PlayCanvas + React + Colyseus Starter](../README.md). A Vite-powered
[`@playcanvas/react`](https://developer.playcanvas.com/user-manual/react/) app with TypeScript,
[`@colyseus/react`](https://github.com/colyseus/react-tools) for multiplayer state, ESLint and
Prettier.

See the [root README](../README.md) for full setup instructions (including the backend), the
quickstart, and architecture notes.

## Usage

```bash
npm install
npm run dev        # runs on http://localhost:5173
```

The frontend automatically connects to `http://localhost:2567` when running on
`localhost`/`127.0.0.1` (see `src/core/colyseus.ts`) — the backend must be running for multiplayer
features to work.

## Scripts

| Command             | Description                       |
| -------------------- | --------------------------------- |
| `npm run dev`         | Start the Vite development server |
| `npm run build`       | Build for production              |
| `npm run start`       | Preview the production build      |
| `npm run lint`        | Run ESLint                        |
| `npm run fmt`         | Check formatting                  |
| `npm run typecheck`   | Run TypeScript checks             |

Run `npm run build` to generate a deployable static site in `dist/`.

## Structure

- `src/core/colyseus.ts` — the shared Colyseus `Client` instance used by every room connection.
- `src/rooms/gameRoom.ts` — `createRoomContext` binding for the `"myroom"` room type
  (`GameRoomProvider`, `useGameRoom`, `useGameRoomState`).
- `src/contexts/AuthContext.tsx` — wraps `@colyseus/auth`'s client SDK and gates routes based on
  sign-in state.
- `src/pages/auth/` — sign-in and account-creation pages.
- `src/game/Scene.tsx` — the PlayCanvas scene.
- `src/core/GameBridge.ts` / `GameStore.ts` — decouple the PlayCanvas scene from the React UI
  layer via a shared `EventTarget` and a minimal observable store.
- `src/ui/SceneUI.tsx` — React UI overlaying the scene (e.g. the "Join Room" button).

## Further reading

- [PlayCanvas React manual](https://developer.playcanvas.com/user-manual/react/)
- [Colyseus documentation](https://docs.colyseus.io/)
- [@colyseus/react hooks](https://github.com/colyseus/react-tools)
- [React documentation](https://react.dev/)
- [Vite documentation](https://vite.dev/)
