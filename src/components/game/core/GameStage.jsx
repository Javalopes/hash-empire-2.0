import React, { useState } from 'react';
import { Stage, Container } from '@pixi/react';
import useGameSync from '../../../hooks/useGameSync.js';
import BackgroundLayer from '../layers/BackgroundLayer.jsx';
import MultiplayerLayer from '../layers/MultiplayerLayer.jsx';
import EntityLayer from '../layers/EntityLayer.jsx';

export default function GameStage() {
  const { user, profileData } = useAuth();
  const { otherPlayers, enviarPosicao } = useGameSync(user);
  const initialX = Number(profileData?.pos_x ?? 500);
  const initialY = Number(profileData?.pos_y ?? 500);
  const [targetPos, setTargetPos] = useState({ x: initialX, y: initialY });

  // Captura o clique no mapa e define o novo destino
  const handlePointerDown = (e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    setTargetPos({ x, y });
  };

  return (
    <div onPointerDown={handlePointerDown} className="w-full h-full cursor-crosshair">
      <Stage 
        width={window.innerWidth} 
        height={window.innerHeight} 
        options={{ backgroundColor: 0x020617, antialias: true }}
      >
        <Container>
          <BackgroundLayer />
          <MultiplayerLayer players={otherPlayers} myId={user} />
          {/* O EntityLayer recebe o destino e avisa o rádio (onMove) */}
          <EntityLayer target={targetPos} onMove={enviarPosicao} />
        </Container>
      </Stage>
    </div>
  );
}
