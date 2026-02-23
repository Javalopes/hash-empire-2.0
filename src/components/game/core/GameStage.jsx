import React from 'react';
import { Stage, Container } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';
import { useGameSync } from '../../../hooks/useGameSync.js';
import BackgroundLayer from '../layers/BackgroundLayer.jsx';
import MultiplayerLayer from '../layers/MultiplayerLayer.jsx';
import EntityLayer from '../layers/EntityLayer.jsx';

export default function GameStage() {
  const { user } = useAuth();
  // ISTO É O QUE FALTA: Chamar o hook para ele ativar o subscribe!
  const { otherPlayers, enviarPosicao } = useGameSync(user);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} options={{ backgroundColor: 0x020617 }}>
      <Container>
        <BackgroundLayer />
        <MultiplayerLayer players={otherPlayers} />
        <EntityLayer onMove={enviarPosicao} />
      </Container>
    </Stage>
  );
}
