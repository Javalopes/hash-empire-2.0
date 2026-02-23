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

  const enviarPosicao = async (x, y, rollback) => {
    if (!userAddress) return;
    // Chama a função RPC mover_mineiro para validar e gravar movimento
    const { data, error } = await supabase.rpc('mover_mineiro', {
      p_id: userAddress,
      p_new_x: x,
      p_new_y: y,
    });
    if (error) {
      // Rollback: volta à posição anterior se falhar
      if (typeof rollback === 'function') rollback();
      return;
    }
    // Só faz broadcast após confirmação do Supabase
    supabase.channel('mapa_geral').send({
      type: 'broadcast',
      event: 'movimento',
      payload: { id: userAddress, x, y },
    });
  };

  return { otherPlayers, enviarPosicao };
};

export default useGameSync; // <--- AGORA É DEFAULT EXPORT
