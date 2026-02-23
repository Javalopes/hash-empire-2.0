import React, { useCallback } from 'react';
import { Stage, Container } from '@pixi/react';
import BackgroundLayer from '../layers/BackgroundLayer.jsx';
import EntityLayer from '../layers/EntityLayer.jsx';
import MultiplayerLayer from '../layers/MultiplayerLayer.jsx';
import useGameSync from '../../../hooks/useGameSync';

const width = window.innerWidth;
const height = window.innerHeight;

export default function GameStage() {
  const { otherPlayers } = useGameSync();

  const handleClick = useCallback((event) => {
    // Coordenadas do clique
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // Atualiza posição do mineiro
    if (EntityLayer.setTarget) EntityLayer.setTarget({ x, y });
  }, []);

  return (
    <Stage
      width={width}
      height={height}
      options={{ antialias: true, backgroundColor: 0x020617 }}
      style={{ width: '100vw', height: '100vh', display: 'block' }}
      onClick={handleClick}
    >
      <Container>
        <BackgroundLayer />
        <MultiplayerLayer players={otherPlayers} />
        <EntityLayer />
      </Container>
    </Stage>
  );
}
