  const enviarPosicao = (x, y) => {
    if (!user) return;
    const walletStr = typeof user === 'string' ? user : user.toString();
    
    supabase.channel('mapa_geral').send({
      type: 'broadcast',
      event: 'movimento',
      payload: { id: walletStr, x, y }, // Forçamos o ID como string
    });
  };
