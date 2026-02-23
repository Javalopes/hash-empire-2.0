import React, { useState, useEffect } from 'react';
import { Stage, Container } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';
import useGameSync from '../../../hooks/useGameSync.js';
import BackgroundLayer from '../layers/BackgroundLayer.jsx';
import MultiplayerLayer from '../layers/MultiplayerLayer.jsx';
import EntityLayer from '../layers/EntityLayer.jsx';

export default function GameStage() {
  const { user, profileData } = useAuth();
  const { otherPlayers, enviarPosicao } = useGameSync(user);
  
  // Câmara inicia onde o jogador está
  const [camPos, setCamPos] = useState({ 
    x: profileData?.pos_x || 500, 
    y: profileData?.pos_y || 500 
  });
  
  const [targetPos, setTargetPos] = useState(null);

  const handleStageClick = (e) => {
    // IMPORTANTE: Coordenada do clique + Deslocamento da Câmara
    const worldX = e.nativeEvent.offsetX + (camPos.x - window.innerWidth / 2);
    const worldY = e.nativeEvent.offsetY + (camPos.y - window.innerHeight / 2);
    
    setTargetPos({ x: worldX, y: worldY });
  };

  return (
    <div onPointerDown={handleStageClick} className="w-full h-screen bg-[#020617]">
      <Stage 
        width={window.innerWidth} 
        height={window.innerHeight} 
        options={{ backgroundColor: 0x020617, antialias: true, eventMode: 'static' }}
      >
        <Container x={(window.innerWidth / 2) - camPos.x} y={(window.innerHeight / 2) - camPos.y}>
          <BackgroundLayer />
          <MultiplayerLayer players={otherPlayers} myId={user} />
          <EntityLayer 
            target={targetPos} 
            onMove={enviarPosicao} 
            onPositionUpdate={(x, y) => setCamPos({ x, y })}
          />
        </Container>
      </Stage>
    </div>
  );
}
