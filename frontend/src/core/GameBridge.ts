type GameEvent = 'ui:event' | 'game:event';

class GameBridge extends EventTarget {
  emitToGame(event: GameEvent, detail?: any) {
    this.dispatchEvent(new CustomEvent(event, { detail }));
  }
  emitToUI(event: GameEvent, detail?: any) {
    this.dispatchEvent(new CustomEvent(event, { detail }));
  }
}
export const gameBridge = new GameBridge();
