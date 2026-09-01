import { Application, Entity } from '@playcanvas/react';
import { Camera } from '@playcanvas/react/components';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from './contexts/AuthContext';
import { client } from './core/colyseus';
import { KeyboardProvider } from './core/KeyboardProvider';
import { Scene } from './game/Scene';
import { GameRoomProvider } from './rooms/gameRoom';
import { SceneUI } from './ui/SceneUI';

function App() {
  const { user, isLoading } = useAuth();
  // Connection is deferred until the user clicks "Join Room" in SceneUI.
  const [shouldJoin, setShouldJoin] = useState(false);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <GameRoomProvider connect={shouldJoin ? () => client.joinOrCreate("myroom") : null}>
        <Application>
          <KeyboardProvider />
          <Entity name="camera" position={[0, 0, 3]}>
            <Camera clearColor="#8099e6" />
          </Entity>
          <Scene />
        </Application>
        <SceneUI onJoinRoom={() => setShouldJoin(true)} />
      </GameRoomProvider>
    </div>
  );
}

export default App;
