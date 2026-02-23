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

const EntityLayer = React.memo(({ target, onMove, onPositionUpdate }) => {
  const { profileData } = useAuth();
  const initialX = Number(profileData?.pos_x ?? INIT_X);
  const initialY = Number(profileData?.pos_y ?? INIT_Y);
  const posRef = useRef({ x: initialX, y: initialY });
  const [pos, setPos] = useState(posRef.current);
  const [targetPos, setTargetPos] = useState(target || posRef.current);
  const hasSpawned = useRef(false);

  useEffect(() => {
    if (profileData && profileData.pos_x != null && profileData.pos_y != null && !hasSpawned.current) {
      const dbX = Number(profileData.pos_x);
      const dbY = Number(profileData.pos_y);
      posRef.current.x = dbX;
      posRef.current.y = dbY;
      setPos({ x: dbX, y: dbY });
      setTargetPos({ x: dbX, y: dbY });
      hasSpawned.current = true;
      if (typeof onPositionUpdate === 'function') onPositionUpdate(dbX, dbY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.pos_x, profileData?.pos_y]);

  useEffect(() => {
    if (target) setTargetPos(target);
  }, [target]);

  useTick(() => {
    if (!profileData || !targetPos) return;
    // Permite movimento sempre que targetPos existe
    const dx = targetPos.x - posRef.current.x;
    const dy = targetPos.y - posRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 1) {
      // Move 5 pixels por frame na direção do destino
      const angle = Math.atan2(dy, dx);
      posRef.current.x += Math.cos(angle) * Math.min(5, dist);
      posRef.current.y += Math.sin(angle) * Math.min(5, dist);
      setPos({ ...posRef.current });
      if (typeof onMove === 'function') onMove(posRef.current.x, posRef.current.y);
      if (typeof onPositionUpdate === 'function') onPositionUpdate(posRef.current.x, posRef.current.y);
    } else if (dist > 0) {
      posRef.current.x = targetPos.x;
      posRef.current.y = targetPos.y;
      setPos({ ...targetPos });
      if (typeof onMove === 'function') onMove(targetPos.x, targetPos.y);
      if (typeof onPositionUpdate === 'function') onPositionUpdate(targetPos.x, targetPos.y);
    }
  });

  const draw = useMemo(() => drawMineiro(pos.x, pos.y), [pos]);

  return <Graphics draw={draw} />;
});

export default EntityLayer;

