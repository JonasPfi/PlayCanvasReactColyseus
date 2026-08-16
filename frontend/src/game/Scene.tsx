import { Entity } from '@playcanvas/react';
import { Light, Render } from '@playcanvas/react/components';
import { useApp, useAppEvent } from '@playcanvas/react/hooks';
import { Keyboard, type Entity as PcEntity } from 'playcanvas';
import { useEffect, useRef } from 'react';
import { gameBridge } from '../core/GameBridge';
import { gameStore } from '../core/GameStore';

export function Scene() {
  const app = useApp();
  const cube = useRef<PcEntity>(null);
  // Rotate the cube according to the delta time since the last frame
  useAppEvent('update', (dt: number) => cube.current?.rotate(10 * dt, 20 * dt, 30 * dt));
  useEffect(() => {
    const handleUiEvent = () => {
      gameStore.setState({ test: gameStore.getState().test + 1 });
      console.log('Game got UI event. Event count:', gameStore.getState().test);
    };
    gameBridge.addEventListener('ui:event', handleUiEvent);

    const keyboard = new Keyboard(window);
    app.keyboard = keyboard;
    const handleKeyDown = (event: any) => {
      gameBridge.emitToUI('game:event', event);
    };
    keyboard.on('keydown', handleKeyDown);

    return () => {
      gameBridge.removeEventListener('ui:event', handleUiEvent);
      keyboard.off('keydown', handleKeyDown);
      app.keyboard = null;
    }
  }, []);

  return (
    <>
      <Entity name="light" rotation={[45, 0, 0]}>
        <Light type="directional" />
      </Entity>
      <Entity name="cube" ref={cube}>
        <Render type="box" />
      </Entity>
    </>
  );
}
