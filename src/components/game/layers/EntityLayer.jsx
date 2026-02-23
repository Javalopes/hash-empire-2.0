mport React, { useRef, useEffect } from 'react';
import { Graphics, useTick } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';

export default function EntityLayer({ target, onMove, onPositionUpdate }) {
  const { profileData } = useAuth();
  
  // 1. Posição inicial vinda do perfil (DB)
  const pos = useRef({ 
    x: Number(profileData?.pos_x ?? 500), 
    y: Number(profileData?.pos_y ?? 500) 
  });
  
  const hasSpawned = useRef(false);
  const lastSentPos = useRef({ x: 0, y: 0 });

  // 2. Sincronização de Spawn (Teleporte inicial)
  useEffect(() => {
    if (profileData && !hasSpawned.current) {
      pos.current.x = Number(profileData.pos_x);
      pos.current.y = Number(profileData.pos_y);
      if (onPositionUpdate) onPositionUpdate(pos.current.x, pos.current.y);
      hasSpawned.current = true;
    }
  }, [profileData, onPositionUpdate]);

  // 3. Motor de Movimento (Velocidade constante 4px)
  useTick((delta) => {
    if (!target) return;

    const dx = target.x - pos.current.x;
    const dy = target.y - pos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 1) {
      const speed = 4 * delta; 
      const ratio = Math.min(speed / distance, 1);
      
      pos.current.x += dx * ratio;
      pos.current.y += dy * ratio;

      // Atualiza Câmara em tempo real
      if (onPositionUpdate) onPositionUpdate(pos.current.x, pos.current.y);

      // Sincronização Multiplayer (Trava de 5px para não matar o Supabase)
      const distMoved = Math.sqrt(
        Math.pow(pos.current.x - lastSentPos.current.x, 2) + 
        Math.pow(pos.current.y - lastSentPos.current.y, 2)
      );

      if (distMoved > 5 && onMove) {
        onMove(pos.current.x, pos.current.y);
        lastSentPos.current = { x: pos.current.x, y: pos.current.y };
      }
    }
  });

  return (
    <Graphics
      draw={(g) => {
        g.clear();
        // Aura Neon
        g.beginFill(0x22d3ee, 0.3);
        g.drawCircle(pos.current.x, pos.current.y, 16);
        g.endFill();

        // Corpo do Mineiro (Ciano)
        g.beginFill(0x22d3ee, 1);
        g.drawCircle(pos.current.x, pos.current.y, 10);
        g.endFill();

        // Núcleo (Ponto Branco)
        g.beginFill(0xffffff, 0.6);
        g.drawCircle(pos.current.x, pos.current.y, 4);
        g.endFill();
      }}
    />
  );
}