import React, { useState } from 'react';
import { Stage, Container } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';
import { useGameSync } from '../../../hooks/useGameSync.js';
import BackgroundLayer from '../layers/BackgroundLayer.jsx';
import MultiplayerLayer from '../layers/MultiplayerLayer.jsx';
import EntityLayer from '../layers/EntityLayer.jsx';

export default function GameStage() {
  const { user } = useAuth();
  const { otherPlayers, enviarPosicao } = useGameSync(user);
  const [clickPos, setClickPos] = useState(null);

  // Função de clique
  const handleStageClick = (e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    setClickPos({ x, y });
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      options={{ backgroundColor: 0x020617 }}
      eventMode="static"
      onPointerDown={handleStageClick}
    >
      <Container>
        <BackgroundLayer />
        <MultiplayerLayer players={otherPlayers} />
        <EntityLayer target={clickPos} onMove={enviarPosicao} />
      </Container>
    </Stage>
  );
}
