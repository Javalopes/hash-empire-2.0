import React, { useMemo, useEffect, useState } from 'react';
import { Container, Graphics, Text } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';
import { supabase } from '../../../lib/supabase';

const LOTE_SIZE = 256;
const ROAD_SIZE = 64;
const MAP_SIZE = 5000;
const BASE_COLOR = 0x1e293b;
const BASE_ALPHA = 0.4;
const HIGHLIGHT_COLOR = 0x22d3ee;
const HIGHLIGHT_ALPHA = 0.9;
const ROAD_COLOR = 0x0f172a;
const ROAD_ALPHA = 1;
const RADIUS = 2000;

function getLotCoords(x, y) {
  // Calcula a posição relativa ao grid urbanístico
  const gridStep = LOTE_SIZE + ROAD_SIZE;
  return {
    lotX: Math.floor(x / gridStep),
    lotY: Math.floor(y / gridStep)
  };
}

function isInsideLot(x, y, px, py) {
  // Verifica se (x,y) está dentro do lote (não na estrada)
  return (
    x >= px && x < px + LOTE_SIZE &&
    y >= py && y < py + LOTE_SIZE
  );
}

const LandLayer = ({ playerPos }) => {
    const { user } = useAuth();
    const [ownedLots, setOwnedLots] = useState([]);
    const [allLotes, setAllLotes] = useState([]);

    useEffect(() => {
      // Carrega todos os lotes ocupados uma vez
      supabase
        .from('land_registry')
        .select('*')
        .then(({ data }) => {
          setOwnedLots(data || []);
        });
      // Carrega todos os lotes para visibilidade global
      supabase
        .from('land_registry')
        .select('*')
        .then(({ data }) => {
          setAllLotes(data || []);
        });
    }, []);
  // Calcula o lote atual do jogador
  const gridStep = LOTE_SIZE + ROAD_SIZE;
  const { lotX: playerLotX, lotY: playerLotY } = getLotCoords(playerPos.x, playerPos.y);

  // Calcula os lotes visíveis num raio de 2000px
  const minX = Math.max(0, playerPos.x - RADIUS);
  const maxX = Math.min(MAP_SIZE, playerPos.x + RADIUS);
  const minY = Math.max(0, playerPos.y - RADIUS);
  const maxY = Math.min(MAP_SIZE, playerPos.y + RADIUS);

  const lots = useMemo(() => {
    const arr = [];
    for (let x = Math.floor(minX / gridStep); x <= Math.floor(maxX / gridStep); x++) {
      for (let y = Math.floor(minY / gridStep); y <= Math.floor(maxY / gridStep); y++) {
        arr.push({ x, y });
      }
    }
    return arr;
  }, [minX, maxX, minY, maxY, gridStep]);

  return (
    <Container>
      {/* Desenha as estradas (espaço entre lotes) */}
      {lots.map(({ x, y }) => {
        const px = x * gridStep;
        const py = y * gridStep;
        // Estrada horizontal
        if (py + LOTE_SIZE < MAP_SIZE) {
          <Graphics
            key={`road-h-${x}-${y}`}
            draw={g => {
              g.clear();
              g.beginFill(ROAD_COLOR, ROAD_ALPHA);
              g.drawRect(px, py + LOTE_SIZE, LOTE_SIZE, ROAD_SIZE);
              g.endFill();
            }}
          />
        }
        // Estrada vertical
        if (px + LOTE_SIZE < MAP_SIZE) {
          <Graphics
            key={`road-v-${x}-${y}`}
            draw={g => {
              g.clear();
              g.beginFill(ROAD_COLOR, ROAD_ALPHA);
              g.drawRect(px + LOTE_SIZE, py, ROAD_SIZE, LOTE_SIZE);
              g.endFill();
            }}
          />
        }
        return null;
      })}
      {/* Desenha os lotes com cores de dono */}
      {lots.map(({ x, y }) => {
        const px = x * gridStep;
        const py = y * gridStep;
        // Verifica se o mineiro está dentro do lote
        const isPlayerLot = isInsideLot(playerPos.x, playerPos.y, px, py);
        // Busca dono do lote
        const lote = allLotes.find(l => l.coord_x === x && l.coord_y === y);
        let fillColor = null;
        let borderColor = BASE_COLOR;
        let borderAlpha = BASE_ALPHA;
        // Verificação correta de dono (ignora maiúsculas/minúsculas)
        const isMine = lote && String(lote.owner_id).toLowerCase() === String(user?.id || user).toLowerCase();
        if (lote && lote.owner_id) {
          if (isMine) {
            // Meu lote
            fillColor = HIGHLIGHT_COLOR;
            borderColor = 0xffd700; // Dourado
            borderAlpha = 1;
          } else {
            // Lote de outro
            borderColor = 0xf87171; // Vermelho suave
            borderAlpha = 1;
          }
        } else if (isPlayerLot) {
          borderColor = HIGHLIGHT_COLOR;
          borderAlpha = HIGHLIGHT_ALPHA;
        }
        // Portais: 4 lados
        // Portais: 4 lados, desenhados no centro de cada parede
        // Portas: 4 retângulos no meio das bordas
        const portals = [
          { side: 'N', x: px + (LOTE_SIZE / 2) - 16, y: py - 4, w: 32, h: 8 }, // Topo
          { side: 'S', x: px + (LOTE_SIZE / 2) - 16, y: py + LOTE_SIZE - 4, w: 32, h: 8 }, // Fundo
          { side: 'E', x: px + LOTE_SIZE - 4, y: py + (LOTE_SIZE / 2) - 16, w: 8, h: 32 }, // Direita
          { side: 'W', x: px - 4, y: py + (LOTE_SIZE / 2) - 16, w: 8, h: 32 }, // Esquerda
        ];

        // Mineiro colide com portal?
        const portalCollisions = portals.map(portal => {
          const pxMid = portal.x + portal.w / 2;
          const pyMid = portal.y + portal.h / 2;
          const dist = Math.sqrt((playerPos.x - pxMid) ** 2 + (playerPos.y - pyMid) ** 2);
          return dist < 24; // Colisão se mineiro está a menos de 24px do centro da porta
        });

        return (
          <React.Fragment key={`lot-${x}-${y}`}>
            <Graphics
              draw={g => {
                g.clear();
                // Lote
                if (fillColor && isMine) {
                  g.beginFill(fillColor, 0.2);
                  g.drawRect(px, py, LOTE_SIZE, LOTE_SIZE);
                  g.endFill();
                }
                g.lineStyle(2, borderColor, borderAlpha);
                g.drawRect(px, py, LOTE_SIZE, LOTE_SIZE);
                // Portas (após o lote)
                portals.forEach((portal) => {
                  let color = 0x475569;
                  let alpha = 0.7;
                  if (isMine) {
                    color = 0x22d3ee;
                    alpha = 0.9;
                  }
                  g.beginFill(color, alpha);
                  g.drawRect(portal.x, portal.y, portal.w, portal.h);
                  g.endFill();
                });
              }}
            />
            <Text
              text={`LOTE ${x},${y}`}
              x={px + 6}
              y={py + 6}
              style={{ fontSize: 18, fill: borderColor, alpha: borderAlpha, fontWeight: 'bold' }}
            />
          </React.Fragment>
        );
      })}
    </Container>
  );
};

export default LandLayer;
