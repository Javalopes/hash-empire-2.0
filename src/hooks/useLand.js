import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const GRID_STEP = 256 + 64;

export default function useLand(playerPos) {
  const [currentLote, setCurrentLote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buying, setBuying] = useState(false);
  const lastCoords = useRef({ cx: null, cy: null });

  // Função para reivindicar lote
  async function reivindicar(cx, cy, wallet) {
    setBuying(true);
    const { data, error } = await supabase.rpc('reivindicar_lote', {
      p_wallet: wallet,
      p_cx: cx,
      p_cy: cy
    });
    setBuying(false);
    // Refresh do lote
    setLoading(true);
    const { data: loteData } = await supabase
      .from('land_registry')
      .select('*')
      .match({ coord_x: cx, coord_y: cy })
      .maybeSingle();
    setCurrentLote(loteData || { coord_x: cx, coord_y: cy, status: 'disponivel', price: 1000, owner: null });
    setLoading(false);
  }

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

  return { currentLote, loading, buying, reivindicar };
}
