import React, { useRef, useEffect } from 'react';
import { Graphics, useTick } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';

export default function EntityLayer({ target, onMove, onPositionUpdate }) {
  const { profileData } = useAuth();
  
  // 1. Posição inicial vinda diretamente da base de dados
  const pos = useRef({ 
    x: profileData?.pos_x ?? 500, 
    y: profileData?.pos_y ?? 500 
  });
  
  const hasSpawned = useRef(false);

  // 2. Sincronização de Spawn (Teleporte imediato no login)
  useEffect(() => {
    if (profileData && !hasSpawned.current) {
      pos.current.x = Number(profileData.pos_x);
      pos.current.y = Number(profileData.pos_y);
      if (onPositionUpdate) onPositionUpdate(pos.current.x, pos.current.y);
      hasSpawned.current = true;
      console.log("📍 [SPAWN] Mineiro posicionado em:", pos.current.x, pos.current.y);
    }
  }, [profileData, onPositionUpdate]);

  // 3. Loop de Movimento (O motor do boneco)
  useTick((delta) => {
    // Se não houver alvo ou o perfil não carregou, não faz nada
    if (!target || !profileData) return;

    const dx = target.x - pos.current.x;
    const dy = target.y - pos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Se a distância for relevante, desliza (Lerp)
    if (distance > 1) {
      const speed = 0.1 * delta;
      pos.current.x += dx * speed;
      pos.current.y += dy * speed;
      
      // ATUALIZA A CÂMARA (Vital para o GameStage seguir o boneco)
      if (onPositionUpdate) {
        onPositionUpdate(pos.current.x, pos.current.y);
      }
      
      // AVISA OS OUTROS JOGADORES (Multiplayer)
      if (onMove) {
        onMove(pos.current.x, pos.current.y);
      }
    }
  });

  return (
    <Graphics
      draw={(g) => {
        g.clear();
        // Círculo Ciano Néon (O Teu Mineiro)
        g.beginFill(0x22d3ee, 1);
        g.drawCircle(pos.current.x, pos.current.y, 12);
        g.endFill();
        
        // Efeito de brilho interno
        g.beginFill(0xffffff, 0.3);
        g.drawCircle(pos.current.x, pos.current.y, 4);
        g.endFill();
      }}
    />
  );
}

