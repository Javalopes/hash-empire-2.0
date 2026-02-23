import React from 'react';
import { Stage, Container } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';
import useGameSync from '../../../hooks/useGameSync.js'; // <--- IMPORT SIMPLES
import BackgroundLayer from '../layers/BackgroundLayer.jsx';
import MultiplayerLayer from '../layers/MultiplayerLayer.jsx';
import EntityLayer from '../layers/EntityLayer.jsx';

export default function GameStage() {
  const { user } = useAuth();
  const { otherPlayers, enviarPosicao } = useGameSync(user);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} options={{ backgroundColor: 0x020617 }}>
      <Container>
        <BackgroundLayer />
        {/* Passamos o myId para filtrar o clone rosa */}
        <MultiplayerLayer players={otherPlayers} myId={user} />
        <EntityLayer onMove={enviarPosicao} />
      </Container>
    </Stage>
  );
}
