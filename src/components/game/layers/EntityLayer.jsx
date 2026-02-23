import React, { useRef, useEffect } from 'react';
import { Graphics, useTick } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';

export default function EntityLayer({ target, onMove, onPositionUpdate }) {
  const { profileData } = useAuth();
  
  // Referência para a posição atual (essencial para performance no PixiJS)
  const pos = useRef({ 
    x: profileData?.pos_x ?? 500, 
    y: profileData?.pos_y ?? 500 
  });
  
  const hasSpawned = useRef(false);

  // 1. Sincronização de Spawn Inicial (Teleporte imediato sem deslize)
  useEffect(() => {
    if (profileData && !hasSpawned.current) {
      pos.current.x = Number(profileData.pos_x);
      pos.current.y = Number(profileData.pos_y);
      
      // Forçar a câmara a saltar para aqui logo no início
      if (onPositionUpdate) {
        onPositionUpdate(pos.current.x, pos.current.y);
      }
      
      hasSpawned.current = true;
      console.log("📍 [SPAWN] Mineiro posicionado em:", pos.current.x, pos.current.y);
    }
  }, [profileData, onPositionUpdate]);

  // 2. Loop de Movimento (60 FPS)
  useTick((delta) => {
    // Se não houver alvo definido pelo clique, o boneco fica parado
    if (!target) return;

    // Cálculo da distância entre posição atual e destino
    const dx = target.x - pos.current.x;
    const dy = target.y - pos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Se a distância for maior que 1 pixel, executa o deslize (Lerp)
    if (distance > 1) {
      // 0.1 é a suavidade do movimento; delta garante consistência de frames
      const speed = 0.1 * delta;
      
      pos.current.x += dx * speed;
      pos.current.y += dy * speed;
      
      // ATUALIZA A CÂMARA EM TEMPO REAL (Para o GameStage seguir o boneco)
      if (onPositionUpdate) {
        onPositionUpdate(pos.current.x, pos.current.y);
      }
      
      // ATUALIZA O MULTIPLAYER E A DB (Avisa os outros e salva posição)
      if (onMove) {
        onMove(pos.current.x, pos.current.y);
      }
    }
  });

  return (
    <Graphics
      draw={(g) => {
        g.clear();
        
        // Sombra/Glow do mineiro
        g.beginFill(0x22d3ee, 0.3);
        g.drawCircle(pos.current.x, pos.current.y, 16);
        g.endFill();

        // Corpo do mineiro (Ciano Néon)
        g.beginFill(0x22d3ee, 1);
        g.drawCircle(pos.current.x, pos.current.y, 10);
        g.endFill();
        
        // Núcleo de energia (Branco)
        g.beginFill(0xffffff, 0.6);
        g.drawCircle(pos.current.x, pos.current.y, 4);
        g.endFill();
      }}
    />
  );
}
