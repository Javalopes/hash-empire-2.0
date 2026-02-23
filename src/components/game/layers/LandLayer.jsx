import React, { useMemo, useEffect, useState } from 'react';
import { Container, Graphics, Text } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';
import { supabase } from '../../../lib/supabase';
import * as PIXI from 'pixi.js';

const LOTE_SIZE = 256;
const ROAD_SIZE = 64;
const MAP_SIZE = 5000;
const GRID_STEP = LOTE_SIZE + ROAD_SIZE;
const RADIUS = 1500; 

const LandLayer = ({ playerPos }) => {
  const { user } = useAuth(); 
  const [allLotes, setAllLotes] = useState([]);

  useEffect(() => {
    const carregarLotes = async () => {
      const { data } = await supabase.from('land_registry').select('*');
      if (data) {
        setAllLotes(data);
        console.log("🏙️ [MAPA] Lotes carregados da DB:", data.length);
      }
    };
    carregarLotes();
    
    const channel = supabase.channel('land-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'land_registry' }, carregarLotes)
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Extração limpa da Wallet
  const myWallet = useMemo(() => {
    const raw = typeof user === 'string' ? user : user?.id || '';
    return raw.toString().trim(); 
  }, [user]);

  const visibleLots = useMemo(() => {
    const arr = [];
    const startX = Math.max(0, Math.floor((playerPos.x - RADIUS) / GRID_STEP));
    const endX = Math.min(Math.floor(MAP_SIZE / GRID_STEP), Math.ceil((playerPos.x + RADIUS) / GRID_STEP));
    const startY = Math.max(0, Math.floor((playerPos.y - RADIUS) / GRID_STEP));
    const endY = Math.min(MAP_SIZE / GRID_STEP, Math.ceil((playerPos.y + RADIUS) / GRID_STEP));

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        arr.push({ x, y });
      }
    }
    return arr;
  }, [playerPos.x, playerPos.y]);

  return (
    <Container>
      {visibleLots.map(({ x, y }) => {
        const px = x * GRID_STEP;
        const py = y * GRID_STEP;
        
        const isPlayerInside = playerPos.x >= px && playerPos.x < px + LOTE_SIZE && 
                               playerPos.y >= py && playerPos.y < py + LOTE_SIZE;

        const dbLote = allLotes.find(l => l.coord_x === x && l.coord_y === y);
        const ownerWallet = dbLote?.owner_id ? String(dbLote.owner_id).trim() : '';
        const isMine = ownerWallet !== '' && ownerWallet === myWallet;

        // --- LOGS DE DEBUG ---
        // Só faz log se houver um dono e o jogador estiver dentro ou perto do lote
        if (dbLote?.owner_id && isPlayerInside) {
          console.log(`🧐 [CONFRONTO LOTE ${x},${y}]`);
          console.log(`   > Wallet DB: "${ownerWallet}" (Length: ${ownerWallet.length})`);
          console.log(`   > Wallet TU: "${myWallet}" (Length: ${myWallet.length})`);
          console.log(`   > Match: ${isMine ? "✅ SIM" : "❌ NÃO"}`);
        }

        let borderColor = 0x1e293b;
        let borderAlpha = 0.4;
        let fillColor = null;

        if (isMine) {
          borderColor = 0xffd700; // DOURADO
          borderAlpha = 1;
          fillColor = 0x22d3ee;
        } else if (dbLote?.owner_id) {
          borderColor = 0xf87171; // VERMELHO
          borderAlpha = 1;
        } else if (isPlayerInside) {
          borderColor = 0x22d3ee; // CIANO
          borderAlpha = 0.9;
        }

        return (
          <Container key={`lote-${x}-${y}`}>
            <Graphics draw={g => {
              g.clear();
              // Estradas
              g.beginFill(0x0f172a, 1);
              g.drawRect(px + LOTE_SIZE, py, ROAD_SIZE, LOTE_SIZE + ROAD_SIZE);
              g.drawRect(px, py + LOTE_SIZE, LOTE_SIZE + ROAD_SIZE, ROAD_SIZE);
              g.endFill();

              // Lote
              if (isMine) {
                g.beginFill(fillColor, 0.15);
                g.drawRect(px, py, LOTE_SIZE, LOTE_SIZE);
                g.endFill();
              }
              
              g.lineStyle(2, borderColor, borderAlpha);
              g.drawRect(px, py, LOTE_SIZE, LOTE_SIZE);

              // Portas
              const portalColor = isMine ? 0x22d3ee : 0x475569;
              g.beginFill(portalColor, 1);
              g.drawRect(px + 112, py - 4, 32, 8);
              g.drawRect(px + 112, py + 252, 32, 8);
              g.drawRect(px + 252, py + 112, 8, 32);
              g.drawRect(px - 4, py + 112, 8, 32);
              g.endFill();
            }} />

            <Text
              text={`LOTE ${x},${y}`}
              x={px + 10} y={py + 10}
              style={new PIXI.TextStyle({ 
                fontSize: 14, 
                fill: borderColor, 
                fontWeight: 'bold',
                fontFamily: 'monospace'
              })}
            />
          </Container>
        );
      })}
    </Container>
  );
};

export default LandLayer;