import { Entity } from '@playcanvas/react';
import { Light, Render } from '@playcanvas/react/components';
import { useAppEvent } from '@playcanvas/react/hooks';
import { KEY_SPACE, type Entity as PcEntity } from 'playcanvas';
import { useCallback, useEffect, useRef } from 'react';
import { gameBridge } from '../core/GameBridge';
import { gameStore } from '../core/GameStore';
import type { KeyboardEvents } from '../core/KeyboardProvider';
import { useCustomAppEvent } from '../core/useCustomAppEvent';

export function Scene() {
  const cube = useRef<PcEntity>(null);
  // Rotate the cube according to the delta time since the last frame
  useAppEvent('update', (dt: number) => cube.current?.rotate(10 * dt, 20 * dt, 30 * dt));

  const handleKeyDown = useCallback((key: number) => {
    if (key === KEY_SPACE) {
      gameBridge.emitToUI('game:event');
    }
  }, []);
  useCustomAppEvent<KeyboardEvents['keyDown']>('keyDown', handleKeyDown);

  useEffect(() => {
    const handleUiEvent = () => {
      gameStore.setState({ test: gameStore.getState().test + 1 });
      console.log('Game got UI event. Event count:', gameStore.getState().test);
    };
    gameBridge.addEventListener('ui:event', handleUiEvent);

    return () => {
      gameBridge.removeEventListener('ui:event', handleUiEvent);
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
