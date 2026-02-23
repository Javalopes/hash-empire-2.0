import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase.js';

const useGameSync = (userAddress) => {
  const [otherPlayers, setOtherPlayers] = useState({});

  useEffect(() => {
    if (!userAddress) return;

    const channel = supabase.channel('mapa_geral', {
      config: { broadcast: { self: false } }
    });

    channel
      .on('broadcast', { event: 'movimento' }, (payload) => {
        const { id, x, y } = payload.payload;
        // Não adiciona o próprio jogador ao mapa de outros
        if (id && id !== userAddress) {
          setOtherPlayers(prev => ({ ...prev, [id]: { x, y } }));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userAddress]);

  // Throttle control com useRef para garantir 1 chamada por segundo
  const lastDbUpdateRef = useRef(0);
  const lastRollbackRef = useRef(null);
  const enviarPosicao = async (x, y, rollback) => {
    if (!userAddress) return;
    // Tipos corretos para RPC
    const rpcPayload = {
      p_id: String(userAddress),
      p_new_x: Number(x),
      p_new_y: Number(y),
    };
    // Broadcast rápido para multiplayer
    supabase.channel('mapa_geral').send({
      type: 'broadcast',
      event: 'movimento',
      payload: { id: userAddress, x: Number(x), y: Number(y) },
    });
    // Throttle: só grava no Supabase a cada 1 segundo
    const now = Date.now();
    if (now - lastDbUpdateRef.current > 1000) {
      lastDbUpdateRef.current = now;
      lastRollbackRef.current = rollback;
      console.log('📡 [RPC] Enviando para DB:', rpcPayload);
      const { data, error } = await supabase.rpc('mover_mineiro', rpcPayload);
      if (error) {
        // Rollback: volta à posição anterior se falhar
        if (typeof lastRollbackRef.current === 'function') lastRollbackRef.current();
        return;
      }
    }
  };

  return { otherPlayers, enviarPosicao };
};

export default useGameSync; // <--- AGORA É DEFAULT EXPORT
