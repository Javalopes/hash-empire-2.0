import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase.js';

const useGameSync = (userAddress) => {
  const [otherPlayers, setOtherPlayers] = useState({});
  const lastUpdate = useRef(0);
  const canalRef = useRef(null);

  useEffect(() => {
    if (!userAddress) return;

    // Criar canal único
    const channel = supabase.channel('mapa_geral', {
      config: { broadcast: { self: false } }
    });

    // Ouvir movimentos dos outros
    channel
      .on('broadcast', { event: 'movimento' }, (payload) => {
        const { id, x, y } = payload.payload;
        if (id) {
          setOtherPlayers(prev => ({
            ...prev,
            [id]: { x: Number(x), y: Number(y) }
          }));
        }
      })
      .subscribe((status) => {
        console.log("🛰️ [REALTIME] Status:", status);
      });

    canalRef.current = channel;

    return () => {
      if (canalRef.current) supabase.removeChannel(canalRef.current);
    };
  }, [userAddress]);

  const enviarPosicao = async (x, y) => {
    if (!userAddress || !canalRef.current) return;

    // 1. Broadcast Rápido (Multiplayer)
    canalRef.current.send({
      type: 'broadcast',
      event: 'movimento',
      payload: { id: userAddress, x, y },
    });

    // 2. Gravação Lenta na DB (RPC) - 1 vez por segundo
    const agora = Date.now();
    if (agora - lastUpdate.current > 1000) {
      lastUpdate.current = agora;
      
      console.log('📡 [RPC] Enviando para DB:', { p_id: userAddress, p_new_x: x, p_new_y: y });

      const { error } = await supabase.rpc('mover_mineiro', {
        p_id: String(userAddress),
        p_new_x: Number(x),
        p_new_y: Number(y)
      });

      if (error) console.error("❌ [RPC ERROR]:", error.message);
    }
  };

  return { otherPlayers, enviarPosicao };
};

// FIX: Exportação default para bater certo com o GameStage.jsx
export default useGameSync;
