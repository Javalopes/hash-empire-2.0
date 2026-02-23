import React from 'react';
import { Graphics, Text } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext';
import useGameSync from '../../../hooks/useGameSync';

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

const MultiplayerLayer = () => {
  const { user, profileData } = useAuth();
  const otherPlayers = useGameSync(user, { x: profileData?.pos_x || 500, y: profileData?.pos_y || 500 });

  return Object.entries(otherPlayers).map(([id, pos]) => (
    <React.Fragment key={id}>
      <Graphics draw={drawPlayer(pos.x, pos.y)} />
      <Text
        text={id}
        x={pos.x - 40}
        y={pos.y - RADIUS - 18}
        style={{ fill: '#ff00ff', fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace' }}
      />
    </React.Fragment>
  ));
};

export default React.memo(MultiplayerLayer);
