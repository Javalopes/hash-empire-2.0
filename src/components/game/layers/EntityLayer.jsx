import React, { useRef, useEffect } from 'react';
import { Graphics, useTick } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';

export default function EntityLayer({ target, onMove, onPositionUpdate }) {
  const { profileData } = useAuth();
  
  // 1. Referência de posição inicial (Lida do Supabase)
  const pos = useRef({ 
    x: Number(profileData?.pos_x ?? 500), 
    y: Number(profileData?.pos_y ?? 500) 
  });
  
  const hasSpawned = useRef(false);

  // 2. Sincronização de Spawn (Teleporte inicial sem deslize)
  useEffect(() => {
    if (profileData && !hasSpawned.current) {
      pos.current.x = Number(profileData.pos_x);
      pos.current.y = Number(profileData.pos_y);
      
      // Atualiza a câmara logo no início
      if (onPositionUpdate) {
        onPositionUpdate(pos.current.x, pos.current.y);
      }
      
      hasSpawned.current = true;
      console.log("📍 [SPAWN] Mineiro posicionado em:", pos.current.x, pos.current.y);
    }
  }, [profileData, onPositionUpdate]);

  // 3. MOTOR DE MOVIMENTO (useTick corre a 60fps)
  useTick((delta) => {
    // Se não houver alvo ou o perfil não carregou, ficamos parados
    if (!target || !profileData) return;

    // Diferença entre onde estou e onde quero ir
    const dx = target.x - pos.current.x;
    const dy = target.y - pos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Só nos movemos se a distância for relevante (evita trepidação)
    if (distance > 0.5) {
      // VELOCIDADE AJUSTADA: 0.05 para deslize suave e progressivo
      const smoothness = 0.05 * Math.min(delta, 2);
      
      pos.current.x += dx * smoothness;
      pos.current.y += dy * smoothness;
      
      // ATUALIZA A CÂMARA (Faz o mapa deslizar no GameStage)
      if (onPositionUpdate) {
        onPositionUpdate(pos.current.x, pos.current.y);
      }
      
      // ATUALIZA O MULTIPLAYER (Informa os outros jogadores)
      if (onMove) {
        onMove(pos.current.x, pos.current.y);
      }
    }
  });

  return (
    <Graphics
      draw={(g) => {
        g.clear();
        
        // Aura Neon Exterior (Brilho)
        g.beginFill(0x22d3ee, 0.2);
        g.drawCircle(pos.current.x, pos.current.y, 18);
        g.endFill();

        // Corpo do Mineiro (Ciano Néon Principal)
        g.beginFill(0x22d3ee, 1);
        g.drawCircle(pos.current.x, pos.current.y, 10);
        g.endFill();
        
        // Núcleo (Ponto de Luz Central)
        g.beginFill(0xffffff, 0.7);
        g.drawCircle(pos.current.x, pos.current.y, 4);
        g.endFill();
      }}
    />
  );
}
