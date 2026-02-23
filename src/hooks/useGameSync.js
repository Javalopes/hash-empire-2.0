import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase.js';

import { useAuth } from '../lib/AuthContext.jsx';

const useGameSync = (userAddress) => {
  const [otherPlayers, setOtherPlayers] = useState({});
  const lastUpdate = useRef(0);
  const canalRef = useRef(null);
  const { profileData } = useAuth();

  useEffect(() => {
    if (!userAddress) return;

    // 1. Inicializar Canal Único
    const channel = supabase.channel('mapa_geral', {
      config: { broadcast: { self: false } }
    });

    // 2. Ouvir os outros (Não mexer aqui, isto é o que te faz ver os outros)
    channel
      .on('broadcast', { event: 'movimento' }, (payload) => {
        const { id, x, y } = payload.payload;
        if (id && id !== userAddress) {
          setOtherPlayers(prev => ({
            ...prev,
            [id]: { x: Number(x), y: Number(y) }
          }));
        }
      })
      // Ouvinte para request_sync: responde com a posição atual
      .on('broadcast', { event: 'request_sync' }, () => {
        // Responde com a posição atual
        if (profileData && profileData.pos_x != null && profileData.pos_y != null) {
          enviarPosicao(Number(profileData.pos_x), Number(profileData.pos_y));
        }
      })
      .subscribe((status) => {
        console.log("🛰️ [REALTIME] Status:", status);
        // Grito de entrada: assim que SUBSCRIBED, pede sincronização
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'request_sync',
            payload: {},
          });
        }
      });

    canalRef.current = channel;

    return () => {
      if (canalRef.current) supabase.removeChannel(canalRef.current);
    };
  }, [userAddress]);

  const enviarPosicao = async (x, y) => {
    if (!userAddress || !canalRef.current) return;

    // Filtro de Spam: trava de tempo de 50ms
    const agora = Date.now();
    if (agora - lastUpdate.current < 50) return;
    lastUpdate.current = agora;

    // Fallback Silencioso: só envia se canal SUBSCRIBED
    if (canalRef.current.state === 'SUBSCRIBED') {
      canalRef.current.send({
        type: 'broadcast',
        event: 'movimento',
        payload: { id: userAddress, x, y },
      });
    }

    // Salvar na DB (A cada 1.5s para não dar 400 por spam)
    if (agora - lastUpdate.current > 1500) {
      // Chamada RPC silenciosa
      supabase.rpc('mover_mineiro', {
        p_id: String(userAddress),
        p_new_x: Number(x),
        p_new_y: Number(y)
      }).then(({ error }) => {
        if (error) console.warn("⚠️ [DB-SYNC] Aguardando coluna last_active ou erro RPC.");
      });
    }
  };

  return { otherPlayers, enviarPosicao };
};

export default useGameSync;
