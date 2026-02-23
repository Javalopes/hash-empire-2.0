import React, { useRef, useEffect } from 'react';
import { Graphics, useTick } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';

export default function EntityLayer({ target, onMove, onPositionUpdate }) {
  const { profileData } = useAuth();
  
  // 1. Posição atual (Ref para performance)
  const pos = useRef({ 
    x: Number(profileData?.pos_x ?? 500), 
    y: Number(profileData?.pos_y ?? 500) 
  });
  
  // 2. Destino atual (Ref para o useTick não perder o rasto)
  const targetRef = useRef(null);
  const hasSpawned = useRef(false);

  // Sincroniza a Prop target com a Ref interna
  useEffect(() => {
    if (target) {
      targetRef.current = target;
    }
  }, [target]);

  // Teleporte de Login
  useEffect(() => {
    if (profileData && !hasSpawned.current) {
      pos.current.x = Number(profileData.pos_x);
      pos.current.y = Number(profileData.pos_y);
      if (onPositionUpdate) onPositionUpdate(pos.current.x, pos.current.y);
      hasSpawned.current = true;
    }
  }, [profileData, onPositionUpdate]);

  // MOTOR DE MOVIMENTO (60 FPS)
  useTick((delta) => {
    // Se não houver destino na Ref, não faz nada
    if (!targetRef.current) return;

    const dx = targetRef.current.x - pos.current.x;
    const dy = targetRef.current.y - pos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Se estiver a mais de 1px, move-te
    if (distance > 1) {
      const speed = 0.05 * Math.min(delta, 2);
      
      pos.current.x += dx * speed;
      pos.current.y += dy * speed;
      
      // Comunica com o exterior (Câmara e Rede)
      if (onPositionUpdate) onPositionUpdate(pos.current.x, pos.current.y);
      if (onMove) onMove(pos.current.x, pos.current.y);
    }
  });

  return (
    <Graphics
      draw={(g) => {
        g.clear();
        // Glow ciano
        g.beginFill(0x22d3ee, 0.3);
        g.drawCircle(pos.current.x, pos.current.y, 16);
        g.endFill();
        // Mineiro
        g.beginFill(0x22d3ee, 1);
        g.drawCircle(pos.current.x, pos.current.y, 10);
        g.endFill();
      }}
    />
  );
}
