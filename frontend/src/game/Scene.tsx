import { Entity } from '@playcanvas/react';
import { Light, Render } from '@playcanvas/react/components';
import { useAppEvent } from '@playcanvas/react/hooks';
import { KEY_SPACE, KEY_S, KEY_A, type Entity as PcEntity } from 'playcanvas';
import { useCallback, useEffect, useRef } from 'react';
import { gameBridge } from '../core/GameBridge';
import { gameStore } from '../core/GameStore';
import type { KeyboardEvents } from '../core/KeyboardProvider';
import { useCustomAppEvent } from '../core/useCustomAppEvent';
import { useGameRoom, useGameRoomState } from '../rooms/gameRoom';

export function Scene() {
  const {room} = useGameRoom();
  const speed = useGameRoomState((state) => state.myRotationSpeed);
  const cube = useRef<PcEntity>(null);
  const keyIsDown = useRef<Map<number, boolean>>(new Map());

  // Rotate the cube according to the delta time since the last frame
  useAppEvent('update', (dt: number) => cube.current?.rotate(10 * dt * (speed ?? 1), 20 * dt * (speed ?? 1), 30 * dt * (speed ?? 1)));

  const handleKeyDown = useCallback((key: number) => {
    if(keyIsDown.current.get(key) === true) return;
    switch(key){
      case KEY_SPACE:
        gameBridge.emitToUI('game:event');
        break;
      case KEY_A:
        room?.send("speedUp");
        break;
      case KEY_S:
        room?.send("slowDown");
        break;
      default:
        break;
    }
    keyIsDown.current.set(key, true);
  }, [room]);
  useCustomAppEvent<KeyboardEvents['keyDown']>('keyDown', handleKeyDown);

  const handleKeyUp = useCallback((key: number) => {
    keyIsDown.current.set(key, false);
  }, []);
  useCustomAppEvent<KeyboardEvents['keyUp']>('keyUp', handleKeyUp);

  useEffect(() => {
    const handleUiEvent = () => {
      gameStore.setState({ localCount: gameStore.getState().localCount + 1 });
      room?.send("increment");
    };
    gameBridge.addEventListener('ui:event', handleUiEvent);

    return () => {
      gameBridge.removeEventListener('ui:event', handleUiEvent);
    }
  }, [room]);

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
