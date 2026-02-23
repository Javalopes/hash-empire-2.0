import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const GRID_STEP = 256 + 64;

export default function useLand(playerPos) {
  const [currentLote, setCurrentLote] = useState(null);
  const [loading, setLoading] = useState(false);
  const lastCoords = useRef({ cx: null, cy: null });

  useEffect(() => {
    if (!playerPos) return;
    const cx = Math.floor(playerPos.x / GRID_STEP);
    const cy = Math.floor(playerPos.y / GRID_STEP);
    console.log('📡 [RADAR] Lote atual:', cx, cy);
    // Só faz pedido se cx/cy mudarem
    if (lastCoords.current.cx === cx && lastCoords.current.cy === cy) return;
    lastCoords.current = { cx, cy };
    setLoading(true);
    supabase
      .from('land_registry')
      .select('*')
      .match({ coord_x: cx, coord_y: cy })
      .maybeSingle()
      .then(({ data, error }) => {
        if (!data) {
          setCurrentLote({ coord_x: cx, coord_y: cy, status: 'disponivel', price: 1000, owner: null });
        } else {
          setCurrentLote(data);
        }
        setLoading(false);
      });
  }, [playerPos]);

  return { currentLote, loading };
}
