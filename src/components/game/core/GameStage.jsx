import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext.jsx';
import { Stage, Container } from '@pixi/react';
import useGameSync from '../../../hooks/useGameSync.js';
import BackgroundLayer from '../layers/BackgroundLayer.jsx';
import MultiplayerLayer from '../layers/MultiplayerLayer.jsx';
import EntityLayer from '../layers/EntityLayer.jsx';

export default function GameStage() {
  const { user, profileData } = useAuth();
  const { otherPlayers, enviarPosicao } = useGameSync(user);
  const initialX = profileData && profileData.pos_x != null ? Number(profileData.pos_x) : null;
  const initialY = profileData && profileData.pos_y != null ? Number(profileData.pos_y) : null;
  const [targetPos, setTargetPos] = useState(
    initialX !== null && initialY !== null ? { x: initialX, y: initialY } : null
  );

  // Estado da câmara: segue o boneco
  const [camPos, setCamPos] = useState({ x: initialX, y: initialY });

  // Captura o clique no mapa e define o novo destino (compensando a câmara)
  const handlePointerDown = (e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    // Compensa a câmara para obter coordenadas reais do mapa
    const realX = x + camPos.x;
    const realY = y + camPos.y;
    setTargetPos({ x: realX, y: realY });
  };

  return (
    <Stage 
      width={window.innerWidth} 
      height={window.innerHeight} 
      options={{ backgroundColor: 0x020617, antialias: true }}
      onPointerDown={handlePointerDown}
    >
      <Container x={ (window.innerWidth / 2) - camPos.x } y={ (window.innerHeight / 2) - camPos.y }>
        <BackgroundLayer />
        <MultiplayerLayer players={otherPlayers} myId={user} />
        {/* O EntityLayer recebe o destino e avisa o rádio (onMove) */}
        <EntityLayer target={targetPos} onMove={enviarPosicao} onPositionUpdate={(x, y) => setCamPos({ x, y })} />
      </Container>
    </Stage>
  );
}
