import { useApp } from '@playcanvas/react/hooks';
import { Keyboard } from 'playcanvas';
import type { KeyboardEvent as PcKeyboardEvent } from 'playcanvas';
import { useEffect } from 'react';

export interface KeyboardEvents {
  keyDown: (key: number) => void;
  keyUp: (key: number) => void;
}

export function KeyboardProvider() {
  const app = useApp();

  useEffect(() => {
    const keyboard = new Keyboard(window);
    app.keyboard = keyboard;

    const handleKeyDown = (event: PcKeyboardEvent) => {
      app.fire('keyDown', event.key);
    };
    const handleKeyUp = (event: PcKeyboardEvent) => {
      app.fire('keyUp', event.key);
    };

    keyboard.on('keydown', handleKeyDown);
    keyboard.on('keyup', handleKeyUp);

    return () => {
      keyboard.off('keydown', handleKeyDown);
      keyboard.off('keyup', handleKeyUp);
      app.keyboard = null;
    };
  }, [app]);

  return null;
}
