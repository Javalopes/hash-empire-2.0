import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';

export default function useGameSync(userId, pos) {
  const [otherPlayers, setOtherPlayers] = useState({});
  const channelRef = useRef(null);
  const lastSentRef = useRef(0);

  // Função para enviar posição
  const enviarPosicao = useCallback((x, y) => {
    if (!userId || !channelRef.current) return;
    const now = Date.now();
    if (now - lastSentRef.current < 100) return; // throttle 100ms
    lastSentRef.current = now;
    channelRef.current.send({
      type: 'broadcast',
      event: 'posicao_jogador',
      payload: { id: userId, x, y },
    });
  }, [userId]);

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

    channel.subscribe(status => {
      if (status === 'SUBSCRIBED') {
        console.log('📡 [REALTIME] Canal subscrito com sucesso');
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  return { otherPlayers, enviarPosicao };
}
