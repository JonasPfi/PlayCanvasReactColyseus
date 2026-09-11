# Backend — Colyseus server

The multiplayer/auth backend for the [PlayCanvas + React + Colyseus Starter](../../README.md).
Built with [Colyseus](https://colyseus.io/) and [`@colyseus/auth`](https://docs.colyseus.io/authentication/).

See the [root README](../../README.md) for setup, environment variables, and architecture notes.

## Usage

```bash
npm install
npm start        # runs on http://localhost:2567
```

Other scripts: `npm test` (mocha test suite), `npm run loadtest` (scriptable load-test client),
`npm run build` (compile to `build/`).

## Structure

- `src/index.ts` — entry point, boots the Colyseus server (`src/app.config.ts`).
- `src/app.config.ts` — registers room handlers and the `@colyseus/auth` routes.
- `src/rooms/MyRoom.ts` — example room with JWT auth (`onAuth`), reconnection support
  (`onDrop`/`onReconnect`), and a synchronized counter.
- `src/rooms/schema/MyRoomState.ts` — the room's synchronized schema, imported as a type-only
  import by the frontend (see the root README's "A note on shared types").
- `src/config/auth.ts` — `@colyseus/auth` configuration; uses an in-memory `fakeDatabase`,
  replace with a real database before shipping anything real.
- `src/config/database.ts` — database setup/connection.
- `loadtest/example.ts` — scriptable client for `npm run loadtest`.
