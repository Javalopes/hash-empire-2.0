import React, { useRef, useEffect } from 'react';
import { Graphics, useTick } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';

export default function EntityLayer({ target, onMove, onPositionUpdate }) {
  const { profileData } = useAuth();
  
  // 1. CARREGAR DADOS DA DB: Iniciamos com o que vem do Supabase (evita o reset para 500,500)
  const pos = useRef({ 
    x: Number(profileData?.pos_x ?? 500), 
    y: Number(profileData?.pos_y ?? 500) 
  });
  
  const targetRef = useRef(null);
  const hasSpawned = useRef(false);

  // Sincroniza o clique do GameStage com o motor
  useEffect(() => {
    if (target) targetRef.current = target;
  }, [target]);

  // 2. SPAWN ÚNICO: Garante que no login o boneco e a câmara saltam para a posição guardada
  useEffect(() => {
    if (profileData && !hasSpawned.current) {
      pos.current.x = Number(profileData.pos_x);
      pos.current.y = Number(profileData.pos_y);
      if (onPositionUpdate) onPositionUpdate(pos.current.x, pos.current.y);
      hasSpawned.current = true;
      console.log("📍 [SISTEMA] Mineiro spawnado da DB em:", pos.current.x, pos.current.y);
    }
  }, [profileData, onPositionUpdate]);

  // 3. MOTOR DE MOVIMENTO: Velocidade constante de 4px por frame
  useTick((delta) => {
    if (!targetRef.current || !profileData) return;

    const dx = targetRef.current.x - pos.current.x;
    const dy = targetRef.current.y - pos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 1) {
      // VELOCIDADE CONSTANTE (ESTILO MMORPG)
      const speed = 4 * delta; 
      const ratio = speed / distance;
      
      if (ratio >= 1) {
        pos.current.x = targetRef.current.x;
        pos.current.y = targetRef.current.y;
      } else {
        pos.current.x += dx * ratio;
        pos.current.y += dy * ratio;
      }
      
      // ATUALIZA O MUNDO: Câmara e Outros Jogadores
      if (onPositionUpdate) onPositionUpdate(pos.current.x, pos.current.y);
      if (onMove) onMove(pos.current.x, pos.current.y);
    }
  });

  return (
    <Graphics
      draw={(g) => {
        g.clear();
        // Desenho do Mineiro Ciano (Mantendo o teu estilo original)
        g.beginFill(0x22d3ee, 0.3); g.drawCircle(pos.current.x, pos.current.y, 16); g.endFill();
        g.beginFill(0x22d3ee, 1); g.drawCircle(pos.current.x, pos.current.y, 10); g.endFill();
        g.beginFill(0xffffff, 0.6); g.drawCircle(pos.current.x, pos.current.y, 4); g.endFill();
      }}
    />
  );
}
