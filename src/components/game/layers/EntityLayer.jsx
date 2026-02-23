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

const EntityLayer = React.memo(({ target, onMove }) => {
  const { profileData } = useAuth();
  const posRef = useRef({
    x: Number(profileData?.pos_x ?? INIT_X),
    y: Number(profileData?.pos_y ?? INIT_Y),
  });
  const [pos, setPos] = useState(posRef.current);
  const [targetPos, setTargetPos] = useState(target || posRef.current);

  // Atualiza posRef na primeira carga válida de profileData
  useEffect(() => {
    if (profileData && profileData.pos_x != null && profileData.pos_y != null) {
      posRef.current.x = Number(profileData.pos_x);
      posRef.current.y = Number(profileData.pos_y);
      setPos({ ...posRef.current });
      setTargetPos({ ...posRef.current });
    }
    // Só executa na primeira carga válida
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.pos_x, profileData?.pos_y]);

  useEffect(() => {
    if (target) setTargetPos(target);
  }, [target]);

  useTick(() => {
    const dx = targetPos.x - posRef.current.x;
    const dy = targetPos.y - posRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 1) {
      // Move 5 pixels por frame na direção do destino
      const angle = Math.atan2(dy, dx);
      posRef.current = {
        x: posRef.current.x + Math.cos(angle) * Math.min(5, dist),
        y: posRef.current.y + Math.sin(angle) * Math.min(5, dist),
      };
      setPos({ ...posRef.current });
      if (typeof onMove === 'function') onMove(posRef.current.x, posRef.current.y);
    } else {
      posRef.current = { ...targetPos };
      setPos({ ...targetPos });
      if (typeof onMove === 'function') onMove(targetPos.x, targetPos.y);
    }
  });

  const draw = useMemo(() => drawMineiro(pos.x, pos.y), [pos]);

  return <Graphics draw={draw} />;
});

export default EntityLayer;

