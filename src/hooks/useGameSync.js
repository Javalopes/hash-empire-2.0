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

  const enviarPosicao = (x, y) => {
    if (!userAddress) return;
    supabase.channel('mapa_geral').send({
      type: 'broadcast',
      event: 'movimento',
      payload: { id: userAddress, x, y },
    });
  };

  return { otherPlayers, enviarPosicao };
};

export default useGameSync; // <--- AGORA É DEFAULT EXPORT
