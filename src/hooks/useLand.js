import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const GRID_STEP = 256 + 64;

export default function useLand(playerPos) {
  const [currentLote, setCurrentLote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buying, setBuying] = useState(false);
  const lastCoord = useRef({ cx: -1, cy: -1 });

  // Função para buscar lote (fora do useEffect)
  const fetchLote = async (cx, cy) => {
    setLoading(true);
    const { data: loteData } = await supabase
      .from('land_registry')
      .select('*')
      .match({ coord_x: cx, coord_y: cy })
      .maybeSingle();
    if (!loteData) {
      setCurrentLote({
        coord_x: cx,
        coord_y: cy,
        status: 'disponivel',
        price: 1000,
        owner: null,
        owner_id: null
      });
    } else {
      setCurrentLote(loteData);
    }
    setLoading(false);
  };

  // Função para reivindicar lote
  async function reivindicar(cx, cy, wallet) {
    setLoading(true);
    await supabase.rpc('reivindicar_lote', {
      p_wallet: wallet,
      p_cx: cx,
      p_cy: cy
    });
    await fetchLote(cx, cy); // Atualiza HUD imediatamente
    setLoading(false);
  }

  useEffect(() => {
    if (!playerPos) return;
    const cx = Math.floor(playerPos.x / GRID_STEP);
    const cy = Math.floor(playerPos.y / GRID_STEP);
    // Só faz pedido se cx/cy mudarem
    if (cx === lastCoord.current.cx && cy === lastCoord.current.cy) return;
    lastCoord.current = { cx, cy };
    console.log('📡 [RADAR] Lote atual:', cx, cy);
    fetchLote(cx, cy);
  }, [playerPos]);

  return { currentLote, reivindicar, loading };
}
