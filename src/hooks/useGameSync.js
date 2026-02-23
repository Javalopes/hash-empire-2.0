import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase.js';

export default function useGameSync(userId, pos) {
  const [otherPlayers, setOtherPlayers] = useState({});
  const channelRef = useRef(null);
  const lastSentRef = useRef(0);

  useEffect(() => {
    if (!userId) return;
    // Subscrição com config para não receber os próprios broadcasts
    const channel = supabase.channel('mapa_geral', {
      broadcast: { self: false }
    });
    channelRef.current = channel;

    // Escuta de dados
    channel.on('broadcast', { event: 'posicao_jogador' }, payload => {
      const { id, x, y } = payload;
      if (id === userId) return; // Ignora o próprio
      console.log('📡 [MULTIPLAYER] Recebi movimento de:', id);
      setOtherPlayers(prev => ({ ...prev, [id]: { x, y } }));
    });

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  useEffect(() => {
    if (!userId || !channelRef.current) return;
    const now = Date.now();
    if (now - lastSentRef.current < 100) return; // throttle 100ms
    lastSentRef.current = now;
    channelRef.current.send({
      type: 'broadcast',
      event: 'posicao_jogador',
      payload: { id: userId, x: pos.x, y: pos.y },
    });
  }, [userId, pos.x, pos.y]);

  return otherPlayers;
}
