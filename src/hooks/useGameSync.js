import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase.js';

export const useGameSync = (userAddress) => {
  const [otherPlayers, setOtherPlayers] = useState({});
  const lastUpdate = useRef(0);
  const canalRef = useRef(null); // Usamos REF para o canal não ser recriado

  useEffect(() => {
    if (!userAddress) return;

    // Criar o canal uma única vez
    const channel = supabase.channel('mapa_geral', {
      config: { broadcast: { self: false } }
    });

    channel
      .on('broadcast', { event: 'movimento' }, (payload) => {
        const { id, x, y } = payload.payload;
        if (id) setOtherPlayers(prev => ({ ...prev, [id]: { x, y } }));
      })
      .subscribe();

    canalRef.current = channel;

    return () => {
      if (canalRef.current) supabase.removeChannel(canalRef.current);
    };
  }, [userAddress]);

  const enviarPosicao = async (x, y) => {
    if (!userAddress || !canalRef.current) return;

    // 1. Broadcast Rápido
    canalRef.current.send({
      type: 'broadcast',
      event: 'movimento',
      payload: { id: userAddress, x, y },
    });

    // 2. RPC para a DB (Controlado)
    const agora = Date.now();
    if (agora - lastUpdate.current > 1000) {
      lastUpdate.current = agora;
      
      // Enviamos os NOMES EXATOS que o SQL espera
      const { error } = await supabase.rpc('mover_mineiro', {
        p_id: String(userAddress),
        p_new_x: Number(x),
        p_new_y: Number(y)
      });

      if (error) console.error("❌ [SUPABASE ERROR]:", error.message);
    }
  };

  return { otherPlayers, enviarPosicao };
};
