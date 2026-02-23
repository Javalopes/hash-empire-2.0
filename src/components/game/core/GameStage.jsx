import React, { useState, useRef } from 'react';
import { useTick } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';
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

  // Câmara seguidora: estado da posição da câmara
  const cameraPos = useRef({ x: (window.innerWidth / 2) - initialX, y: (window.innerHeight / 2) - initialY });

  // Atualiza a posição da câmara para manter o mineiro no centro
  useTick(() => {
    // O mineiro está sempre no centro do ecrã
    cameraPos.current.x = (window.innerWidth / 2) - targetPos.x;
    cameraPos.current.y = (window.innerHeight / 2) - targetPos.y;
  });

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
        <Container x={cameraPos.current.x} y={cameraPos.current.y}>
          <BackgroundLayer />
          <MultiplayerLayer players={otherPlayers} myId={user} />
          {/* O EntityLayer recebe o destino e avisa o rádio (onMove) */}
          <EntityLayer target={targetPos} onMove={enviarPosicao} />
        </Container>
      </Stage>
    </div>
  );
}
