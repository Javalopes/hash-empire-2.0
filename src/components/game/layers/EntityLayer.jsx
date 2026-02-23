import React, { useRef, useEffect } from 'react';
import { Graphics, useTick } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';

export default function EntityLayer({ target, onMove, onPositionUpdate }) {
  const { profileData } = useAuth();
  
  // 1. LOAD DA BASE DE DADOS: Inicia na posição guardada no Supabase
  const pos = useRef({ 
    x: Number(profileData?.pos_x ?? 500), 
    y: Number(profileData?.pos_y ?? 500) 
  });
  
  const targetRef = useRef(null);
  const hasSpawned = useRef(false);

  // Sincroniza o clique (target) com a referência do motor
  useEffect(() => {
    if (target) {
      targetRef.current = target;
    }
  }, [target]);

  // 2. SPAWN FIX: Garante que o boneco "acorda" no sítio certo ao fazer login
  useEffect(() => {
    if (profileData && !hasSpawned.current) {
      pos.current.x = Number(profileData.pos_x);
      pos.current.y = Number(profileData.pos_y);
      // Avisa a câmara para centrar logo no login
      if (onPositionUpdate) onPositionUpdate(pos.current.x, pos.current.y);
      hasSpawned.current = true;
      console.log("🏙️ [SISTEMA] Mineiro carregado da DB em:", pos.current.x, pos.current.y);
    }
  }, [profileData, onPositionUpdate]);

  // 3. MOTOR DE MOVIMENTO: VELOCIDADE CONSTANTE (ESTILO MMORPG)
  useTick((delta) => {
    if (!targetRef.current) return;

    const dx = targetRef.current.x - pos.current.x;
    const dy = targetRef.current.y - pos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Se ainda não chegámos ao destino
    if (distance > 2) {
      // VELOCIDADE FIXA: 4 pixels por frame (ajusta aqui para correr mais ou menos)
      const speed = 4 * delta; 
      
      // Cálculo de direção para velocidade constante
      const ratio = speed / distance;
      
      if (ratio >= 1) {
        pos.current.x = targetRef.current.x;
        pos.current.y = targetRef.current.y;
      } else {
        pos.current.x += dx * ratio;
        pos.current.y += dy * ratio;
      }
      
      // Atualiza Câmara (GameStage) e Rede (Multiplayer)
      if (onPositionUpdate) onPositionUpdate(pos.current.x, pos.current.y);
      if (onMove) onMove(pos.current.x, pos.current.y);
    }
  });

  return (
    <Graphics
      draw={(g) => {
        g.clear();
        // Aura Neon
        g.beginFill(0x22d3ee, 0.2);
        g.drawCircle(pos.current.x, pos.current.y, 18);
        g.endFill();
        // Corpo do Mineiro (Ciano)
        g.beginFill(0x22d3ee, 1);
        g.drawCircle(pos.current.x, pos.current.y, 10);
        g.endFill();
        // Núcleo
        g.beginFill(0xffffff, 0.6);
        g.drawCircle(pos.current.x, pos.current.y, 4);
        g.endFill();
      }}
    />
  );
}
