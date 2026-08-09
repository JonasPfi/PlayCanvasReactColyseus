import { Application, Entity } from '@playcanvas/react';
import { Camera, Light, Render } from '@playcanvas/react/components';
import { useAppEvent } from '@playcanvas/react/hooks';
import type { Entity as PcEntity } from 'playcanvas';
import { useRef } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function Scene() {
  const cube = useRef<PcEntity>(null);


  // Rotate the cube according to the delta time since the last frame
  useAppEvent('update', (dt: number) => cube.current?.rotate(10 * dt, 20 * dt, 30 * dt));

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

function SceneUI() {
  const { logout } = useAuth();

  return (
    <>
      <div className='absolute inset-0 z-10 pointer-events-none'>
        <button
          onClick={logout}
          className="pointer-events-auto absolute top-4 right-4 rounded-lg bg-slate-900/80 px-4 py-2 text-white backdrop-blur hover:bg-slate-800"
        >
          Sign out
        </button>
      </div>
    </>
  );
}

function App() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/create-account" />;
  }

  return (
    <div className='relative w-screen h-screen overflow-hidden'>
      <Application>
        <Entity name="camera" position={[0, 0, 3]}>
          <Camera clearColor="#8099e6" />
        </Entity>
        <Scene />
      </Application>
      <SceneUI />
    </div>
  );
}

export default App;
