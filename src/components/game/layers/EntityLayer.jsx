import React, { useRef, useEffect, useState } from 'react';
import { Graphics, useTick } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';

export default function EntityLayer({ target, onMove, onPositionUpdate, currentLote, user, onEnterEdificio }) {
      // Estado para mostrar botão de entrada
      const [showEnter, setShowEnter] = useState(false);
      // Detecção de proximidade às portas
      useEffect(() => {
        if (!currentLote || !user) {
          setShowEnter(false);
          return;
        }
        // Verifica se é meu lote
        const isMine = String(currentLote.owner_id) === String(user);
        if (!isMine) {
          setShowEnter(false);
          return;
        }
        // Calcula posição do lote
        const LOTE_SIZE = 256;
        const px = currentLote.coord_x * (LOTE_SIZE + 64);
        const py = currentLote.coord_y * (LOTE_SIZE + 64);
        // Portas: 4 lados
        const portals = [
          { x: px + (LOTE_SIZE / 2) - 16, y: py - 4, w: 32, h: 8 }, // Topo
          { x: px + (LOTE_SIZE / 2) - 16, y: py + LOTE_SIZE - 4, w: 32, h: 8 }, // Fundo
          { x: px + LOTE_SIZE - 4, y: py + (LOTE_SIZE / 2) - 16, w: 8, h: 32 }, // Direita
          { x: px - 4, y: py + (LOTE_SIZE / 2) - 16, w: 8, h: 32 }, // Esquerda
        ];
        // Posição do mineiro
        const mx = pos.current.x;
        const my = pos.current.y;
        // Verifica proximidade a qualquer porta
        const nearPortal = portals.some(portal => {
          const pxMid = portal.x + portal.w / 2;
          const pyMid = portal.y + portal.h / 2;
          const dist = Math.sqrt((mx - pxMid) ** 2 + (my - pyMid) ** 2);
          return dist < 24;
        });
        setShowEnter(nearPortal);
      }, [currentLote, user, pos.current.x, pos.current.y]);
    const MAP_SIZE = 5000;
    const { profileData } = useAuth();

    // 1. CARREGAMENTO DA DB: Inicia na posição guardada (evita o reset para 500,500)
    const pos = useRef({
      x: Number(profileData?.pos_x ?? 500),
      y: Number(profileData?.pos_y ?? 500)
    });
    // Ref para última posição enviada ao onMove
    const lastSentPos = useRef({ x: pos.current.x, y: pos.current.y });

  const hasSpawned = useRef(false);

  // Ref para o destino
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

    // ATUALIZA A CÂMARA (Faz o mapa deslizar suavemente)
    if (onPositionUpdate) {
      onPositionUpdate(pos.current.x, pos.current.y);
    }

    // ATUALIZA O MULTIPLAYER (Throttle: só envia se moveu >5px)
    if (onMove) {
      const dx = pos.current.x - lastSentPos.current.x;
      const dy = pos.current.y - lastSentPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 5) {
        onMove(pos.current.x, pos.current.y);
        lastSentPos.current.x = pos.current.x;
        lastSentPos.current.y = pos.current.y;
      }
    }
  });

  return (
    <>
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
      {showEnter && (
        <div style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
          <button
            className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg border-2 border-yellow-400 shadow-lg text-lg hover:bg-yellow-300 transition"
            onClick={onEnterEdificio}
          >
            ENTRAR No Edificio
          </button>
        </div>
      )}
    </>
  );
}
