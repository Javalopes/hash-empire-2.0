import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const LOTE_SIZE = 256;
const ROAD_SIZE = 64;

function getLoteInfo(x, y) {
  const gridStep = LOTE_SIZE + ROAD_SIZE;
  // Ignora estradas: só retorna lote se dentro do quadrado
  const px = x % gridStep;
  const py = y % gridStep;
  if (px >= LOTE_SIZE || py >= LOTE_SIZE) return null; // está na estrada
  const cx = Math.floor(x / gridStep);
  const cy = Math.floor(y / gridStep);
  return { cx, cy };
}

export default function useLand(pos) {
  const [currentLote, setCurrentLote] = useState(null);
  const [loading, setLoading] = useState(false);
  const lastCoords = useRef({ cx: null, cy: null });

  useEffect(() => {
    console.log('🗺️ [LAND] Calculando posição:', pos);
    if (!pos) return;
    const lote = getLoteInfo(pos.x, pos.y);
    if (!lote) {
      setCurrentLote(null);
      setLoading(false);
      return;
    }
    const { cx, cy } = lote;
    // Só faz pedido se cx/cy mudarem
    if (lastCoords.current.cx === cx && lastCoords.current.cy === cy) return;
    lastCoords.current = { cx, cy };
    setLoading(true);
    console.log('📡 [DB-QUERY] Procurando Lote:', cx, cy);
    supabase
      .from('land_registry')
      .select('*')
      .match({ coord_x: cx, coord_y: cy })
      .maybeSingle()
      .then(({ data, error }) => {
        console.log('✅ [DB-RESULT]:', data || 'Lote vazio');
        if (!data) {
          setCurrentLote({ coord_x: cx, coord_y: cy, status: 'disponivel', price: 1000, owner: null });
        } else {
          setCurrentLote(data);
        }
        setLoading(false);
      });
  }, [pos]);

  return { currentLote, loading };
}
