import React from 'react';
import { Stage, Container } from '@pixi/react';
import BackgroundLayer from '../layers/BackgroundLayer.jsx';

const width = window.innerWidth;
const height = window.innerHeight;

export default function GameStage() {
  return (
    <Stage
      width={width}
      height={height}
      options={{ antialias: true, backgroundColor: 0x020617 }}
      style={{ width: '100vw', height: '100vh', display: 'block' }}
    >
      <Container>
        <BackgroundLayer />
      </Container>
    </Stage>
  );
}
