import { useState, useEffect } from 'react';
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

  // Throttle para gravar no Supabase apenas 1 vez por segundo
  let lastDbUpdate = 0;
  let lastRollback = null;
  const enviarPosicao = async (x, y, rollback) => {
    if (!userAddress) return;
    // Arredonda valores para evitar floats imprecisos
    const roundedX = Math.round(Number(x));
    const roundedY = Math.round(Number(y));
    // Broadcast rápido para multiplayer
    supabase.channel('mapa_geral').send({
      type: 'broadcast',
      event: 'movimento',
      payload: { id: userAddress, x: roundedX, y: roundedY },
    });
    // Throttle: só grava no Supabase a cada 1 segundo
    const now = Date.now();
    if (now - lastDbUpdate > 1000) {
      lastDbUpdate = now;
      lastRollback = rollback;
      const { data, error } = await supabase.rpc('mover_mineiro', {
        p_id: userAddress,
        p_new_x: roundedX,
        p_new_y: roundedY,
      });
      if (error) {
        // Rollback: volta à posição anterior se falhar
        if (typeof lastRollback === 'function') lastRollback();
        return;
      }
    }
  };

  return { otherPlayers, enviarPosicao };
};

export default useGameSync; // <--- AGORA É DEFAULT EXPORT
