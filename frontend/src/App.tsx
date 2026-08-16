import { Application, Entity } from '@playcanvas/react';
import { Camera } from '@playcanvas/react/components';
import { Navigate } from 'react-router-dom';

import { useAuth } from './contexts/AuthContext';
import { Scene } from './game/Scene';
import { SceneUI } from './ui/SceneUI';
import { NetworkProvider } from './contexts/NetworkContext';
import { KeyboardProvider } from './core/KeyboardProvider';

function App() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/create-account" />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <NetworkProvider>
        <Application>
          <KeyboardProvider />
          <Entity name="camera" position={[0, 0, 3]}>
            <Camera clearColor="#8099e6" />
          </Entity>
          <Scene />
        </Application>
        <SceneUI />
      </NetworkProvider>
    </div>
  );
}

export default App;
