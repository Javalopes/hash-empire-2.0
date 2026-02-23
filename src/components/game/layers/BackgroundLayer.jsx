import React, { useMemo } from 'react';
import { Graphics } from '@pixi/react';

const GRID_SIZE = 64;
const AREA_SIZE = 5000;
const LINE_COLOR = 0x06b6d4;
const LINE_ALPHA = 0.1;

function drawGrid(g) {
  g.clear();
  g.lineStyle(1, LINE_COLOR, LINE_ALPHA);
  // Vertical lines
  for (let x = 0; x <= AREA_SIZE; x += GRID_SIZE) {
    g.moveTo(x, 0);
    g.lineTo(x, AREA_SIZE);
  }
  // Horizontal lines
  for (let y = 0; y <= AREA_SIZE; y += GRID_SIZE) {
    g.moveTo(0, y);
    g.lineTo(AREA_SIZE, y);
  }
}

const BackgroundLayer = React.memo(() => {
  const draw = useMemo(() => drawGrid, []);
  return <Graphics draw={draw} />;
});

export default BackgroundLayer;
