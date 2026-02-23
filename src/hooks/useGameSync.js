import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

export const useGameSync = (user) => {
  const [otherPlayers, setOtherPlayers] = useState({});

  useEffect(() => {
    if (!user) return;
    console.log("📡 [SISTEMA] Iniciando Canal Multiplayer...");

    const channel = supabase.channel('mapa_geral', {
      config: { broadcast: { self: false } }
    });

    channel
      .on('broadcast', { event: 'movimento' }, (payload) => {
        console.log("👤 [RECEBIDO] Movimento de:", payload.payload.id);
        setOtherPlayers(prev => ({
          ...prev,
          [payload.payload.id]: { x: payload.payload.x, y: payload.payload.y }
        }));
      })
      .subscribe((status) => {
        console.log("🛰️ [REALTIME] Status da Conexão:", status);
      });

    return () => {
      console.log("🔌 [SISTEMA] Desconectando do Canal...");
      supabase.removeChannel(channel);
    };
  }, [user]);

  const enviarPosicao = (x, y) => {
    supabase.channel('mapa_geral').send({
      type: 'broadcast',
      event: 'movimento',
      payload: { id: user, x, y },
    });
  };

  return { otherPlayers, enviarPosicao };
};
