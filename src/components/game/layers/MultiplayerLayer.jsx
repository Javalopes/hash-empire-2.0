import React from 'react';
import { Graphics, Text } from '@pixi/react';

const PLAYER_COLOR = 0xff00ff;
const RADIUS = 20;
const GLOW_RADIUS = 32;
const GLOW_ALPHA = 0.18;

function drawPlayer(x, y) {
  return g => {
    g.clear();
    // Glow
    g.beginFill(PLAYER_COLOR, GLOW_ALPHA);
    g.drawCircle(x, y, GLOW_RADIUS);
    g.endFill();
    // Main circle
    g.beginFill(PLAYER_COLOR, 1);
    g.drawCircle(x, y, RADIUS);
    g.endFill();
  };
}

const MultiplayerLayer = ({ players }) => {
  return Object.entries(players || {}).map(([id, data]) => (
    <React.Fragment key={id}>
      <Graphics draw={drawPlayer(data.x, data.y)} />
      <Text
        text={id}
        x={data.x - 40}
        y={data.y - RADIUS - 18}
        style={{ fill: '#ff00ff', fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace' }}
      />
    </React.Fragment>
  ));
};

export default React.memo(MultiplayerLayer);
