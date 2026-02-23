import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Graphics, useTick } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext';

const COLOR = 0x22d3ee;
const GLOW_COLOR = 0x22d3ee;
const INIT_X = 500;
const INIT_Y = 500;
const RADIUS = 24;
const GLOW_RADIUS = 40;
const GLOW_ALPHA = 0.2;

function drawMineiro(x, y) {
  return g => {
    g.clear();
    // Glow
    g.beginFill(GLOW_COLOR, GLOW_ALPHA);
    g.drawCircle(x, y, GLOW_RADIUS);
    g.endFill();
    // Main circle
    g.beginFill(COLOR, 1);
    g.drawCircle(x, y, RADIUS);
    g.endFill();
  };
}

const EntityLayer = React.memo(() => {
  const { profileData } = useAuth();
  const [target, setTarget] = useState({
    x: profileData?.pos_x || INIT_X,
    y: profileData?.pos_y || INIT_Y,
  });
  const [pos, setPos] = useState(target);
  const posRef = useRef(pos);

  useEffect(() => {
    setTarget({
      x: profileData?.pos_x || INIT_X,
      y: profileData?.pos_y || INIT_Y,
    });
  }, [profileData]);

  useTick(() => {
    // Animate position towards target
    const speed = 0.15;
    const dx = target.x - posRef.current.x;
    const dy = target.y - posRef.current.y;
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      posRef.current = {
        x: posRef.current.x + dx * speed,
        y: posRef.current.y + dy * speed,
      };
      setPos({ ...posRef.current });
    } else {
      posRef.current = { ...target };
      setPos({ ...target });
    }
  });

  const draw = useMemo(() => drawMineiro(pos.x, pos.y), [pos]);

  // Expor função para mover
  EntityLayer.setTarget = setTarget;

  return <Graphics draw={draw} />;
});

export default EntityLayer;
