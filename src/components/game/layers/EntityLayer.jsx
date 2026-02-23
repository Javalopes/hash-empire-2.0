import React, { useRef, useEffect } from 'react';
import { Graphics, useTick } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';

export default function EntityLayer({ target, onMove, onPositionUpdate }) {
  const MAP_SIZE = 5000;
  const { profileData } = useAuth();

  // 1. CARREGAMENTO DA DB: Inicia na posição guardada (evita o reset para 500,500)
  const pos = useRef({
    x: Number(profileData?.pos_x ?? 500),
    y: Number(profileData?.pos_y ?? 500)
  });
  const lastSentPos = useRef({ x: pos.current.x, y: pos.current.y });
  const hasSpawned = useRef(false);
  const targetRef = useRef(target);

  // Atualiza targetRef sempre que a prop target mudar
  useEffect(() => {
    targetRef.current = target;
        }, [target]);

        // 2. SPAWN IMEDIATO: No login, teleporta logo sem deslize
        useEffect(() => {
          if (profileData && !hasSpawned.current) {
            pos.current.x = Number(profileData.pos_x);
            pos.current.y = Number(profileData.pos_y);
            if (onPositionUpdate) onPositionUpdate(pos.current.x, pos.current.y);
            hasSpawned.current = true;
            console.log("📍 [SPAWN] Mineiro carregado em:", pos.current.x, pos.current.y);
          }
        }, [profileData, onPositionUpdate]);

        // 3. MOTOR DE MOVIMENTO: Velocidade Constante (4px por frame)
        useTick((delta) => {
          if (!targetRef.current) return;

          // Cálculo da distância real
          const dx = targetRef.current.x - pos.current.x;
          const dy = targetRef.current.y - pos.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Se estivermos longe do destino, caminhamos
          if (distance > 1.5) {
            // VELOCIDADE FIXA: 4 pixels por frame (mais realista para MMORPG)
            const speed = 4 * delta;
            const ratio = speed / distance;

            // Se a velocidade for maior que a distância, chegámos
            if (ratio >= 1) {
              pos.current.x = targetRef.current.x;
              pos.current.y = targetRef.current.y;
            } else {
              pos.current.x += dx * ratio;
              pos.current.y += dy * ratio;
            }
          }

          // CLAMP: Travar posição entre 0 e MAP_SIZE
          pos.current.x = Math.max(0, Math.min(MAP_SIZE, pos.current.x));
          pos.current.y = Math.max(0, Math.min(MAP_SIZE, pos.current.y));

  return (
    <Graphics
      draw={(g) => {
        g.clear();
        // Aura Neon
        g.beginFill(0x22d3ee, 0.25);
        g.drawCircle(pos.current.x, pos.current.y, 16);
        g.endFill();
        // Corpo do Mineiro (Ciano Sólido)
        g.beginFill(0x22d3ee, 1);
        g.drawCircle(pos.current.x, pos.current.y, 10);
        g.endFill();
        // Núcleo de Energia (Ponto de Luz)
        g.beginFill(0xffffff, 0.6);
        g.drawCircle(pos.current.x, pos.current.y, 4);
        g.endFill();
      }}
    />
  );
}
