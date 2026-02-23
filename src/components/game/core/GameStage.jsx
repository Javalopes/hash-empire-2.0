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
  
  // Inicia a câmara na posição do perfil
  const [camPos, setCamPos] = useState({ 
    x: profileData?.pos_x || 500, 
    y: profileData?.pos_y || 500 
  });
  
  const [targetPos, setTargetPos] = useState(null);

  const handleStageClick = (e) => {
    // Cálculo real: Ponto no ecrã + Deslocamento da Câmara
    const worldX = e.nativeEvent.offsetX - ((window.innerWidth / 2) - camPos.x);
    const worldY = e.nativeEvent.offsetY - ((window.innerHeight / 2) - camPos.y);
    
    console.log("🎯 [MAPA] Novo Destino:", worldX, worldY);
    setTargetPos({ x: worldX, y: worldY });
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-[#020617]">
      <Stage 
        width={window.innerWidth} 
        height={window.innerHeight} 
        options={{ backgroundColor: 0x020617, antialias: true, eventMode: 'static' }}
        onPointerDown={handleStageClick}
      >
        <Container 
          x={(window.innerWidth / 2) - camPos.x} 
          y={(window.innerHeight / 2) - camPos.y}
        >
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
