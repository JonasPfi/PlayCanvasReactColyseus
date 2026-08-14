import { Entity } from '@playcanvas/react';
import { Light, Render } from '@playcanvas/react/components';
import { useAppEvent } from '@playcanvas/react/hooks';
import type { Entity as PcEntity } from 'playcanvas';
import { useEffect, useRef } from 'react';
import { gameBridge } from '../core/GameBridge';

export function Scene() {
  const cube = useRef<PcEntity>(null);
  // Rotate the cube according to the delta time since the last frame
  useAppEvent('update', (dt: number) => cube.current?.rotate(10 * dt, 20 * dt, 30 * dt));

  useEffect(() => {
    const handleUiEvent = () => {
      console.log('Game got UI event');
    };

    gameBridge.addEventListener('ui:event', handleUiEvent);
    return () => gameBridge.removeEventListener('ui:event', handleUiEvent);
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
