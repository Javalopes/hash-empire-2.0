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

const MultiplayerLayer = ({ otherPlayers }) => {
  return Object.values(otherPlayers || {}).map((pos, idx) => (
    <React.Fragment key={idx}>
      <Graphics draw={drawPlayer(pos.x, pos.y)} />
      <Text
        text={pos.id || ''}
        x={pos.x - 40}
        y={pos.y - RADIUS - 18}
        style={{ fill: '#ff00ff', fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace' }}
      />
    </React.Fragment>
  ));
};

export default React.memo(MultiplayerLayer);
