import React, { useRef, useEffect } from 'react';
import { Graphics, useTick } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';

export default function EntityLayer({ target, onMove, onPositionUpdate }) {
  const { profileData } = useAuth();
  
  // Referência de posição inicial vinda do perfil (Supabase)
  const pos = useRef({ 
    x: Number(profileData?.pos_x ?? 500), 
    y: Number(profileData?.pos_y ?? 500) 
  });
  
  const hasSpawned = useRef(false);

  // 1. Sincronização de Spawn (Teleporte inicial sem deslize no login)
  useEffect(() => {
    if (profileData && !hasSpawned.current) {
      pos.current.x = Number(profileData.pos_x);
      pos.current.y = Number(profileData.pos_y);
      
      // Força a câmara a centrar-se no spawn imediatamente
      if (onPositionUpdate) {
        onPositionUpdate(pos.current.x, pos.current.y);
      }
      
      hasSpawned.current = true;
      console.log("📍 [SPAWN] Mineiro posicionado em:", pos.current.x, pos.current.y);
    }
  }, [profileData, onPositionUpdate]);

  // 2. Motor de Movimento Suave (useTick a 60fps)
  useTick((delta) => {
    // Se não houver alvo ou o perfil não carregou, ficamos estáticos
    if (!target || !profileData) return;

    // Cálculo da distância entre posição atual e destino (Vetor)
    const dx = target.x - pos.current.x;
    const dy = target.y - pos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Só movemos se a distância for superior a um limite mínimo (evita trepidação)
    if (distance > 0.5) {
      // VELOCIDADE DE DESLIZE: 0.05 para um movimento suave e constante
      // delta garante que a velocidade é a mesma independentemente do monitor
      const lerpFactor = 0.05 * Math.min(delta, 2);
      
      pos.current.x += dx * lerpFactor;
      pos.current.y += dy * lerpFactor;
      
      // ATUALIZA A CÂMARA (Sincroniza o deslize do mapa no GameStage)
      if (onPositionUpdate) {
        onPositionUpdate(pos.current.x, pos.current.y);
      }
      
      // ATUALIZA O MULTIPLAYER (Envia broadcast para os outros jogadores)
      if (onMove) {
        onMove(pos.current.x, pos.current.y);
      }
    }
  });

  return (
    <Graphics
      draw={(g) => {
        g.clear();
        
        // Aura Neon (Glow Exterior)
        g.beginFill(0x22d3ee, 0.2);
        g.drawCircle(pos.current.x, pos.current.y, 18);
        g.endFill();

        // Corpo do Mineiro (Ciano Néon Sólido)
        g.beginFill(0x22d3ee, 1);
        g.drawCircle(pos.current.x, pos.current.y, 10);
        g.endFill();
        
        // Núcleo de Energia (Ponto de Luz)
        g.beginFill(0xffffff, 0.7);
        g.drawCircle(pos.current.x, pos.current.y, 4);
        g.endFill();
      }}
    />
  );
}
