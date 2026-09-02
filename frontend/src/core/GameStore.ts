import { useSyncExternalStore } from 'react';

type GameState = {
  localCount: number;
};

type Listener = () => void;

class GameStore {
  private state: GameState = {
    localCount: 0,
  };
  private listeners = new Set<Listener>();

  getState = (): GameState => this.state;

  setState = (patch: Partial<GameState>) => {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  };

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
}

export const gameStore = new GameStore();

export function useGameStore<T>(selector: (state: GameState) => T): T {
  return useSyncExternalStore(
    gameStore.subscribe,
    () => selector(gameStore.getState())
  );
}
