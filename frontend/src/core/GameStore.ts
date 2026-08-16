type GameState = {
  test: number;
};

type Listener = () => void;

class GameStore {
  private state: GameState = {
    test: 0,
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
