jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPhantom, setHasPhantom] = useState(false);

  useEffect(() => {
    console.log("🔍 [DEBUG] Inicializando AuthProvider...");
    let checkInterval;
    let attempts = 0;

    const findPhantom = async () => {
      console.log(`🔎 [DEBUG] Tentativa ${attempts} de encontrar Phantom...`);
      
      // Verificação direta no objeto window
      const isPhantomInstalled = window?.solana?.isPhantom;
      
      if (isPhantomInstalled) {
        console.log("✅ [DEBUG] PHANTOM DETECTADA!");
        setHasPhantom(true);
        if (checkInterval) clearInterval(checkInterval);

        try {
          console.log("📡 [DEBUG] Tentando conexão automática (Trusted)...");
          const resp = await window.solana.connect({ onlyIfTrusted: true });
          const address = resp.publicKey.toString();
          console.log("👤 [DEBUG] Auto-login bem-sucedido:", address);
          setUser(address);
          await fetchProfile(address);
        } catch (err) {
          console.log("ℹ️ [DEBUG] Sem auto-login (Necessário clique manual)");
        }
        setLoading(false);
        return true;
      }
      return false;
    };

    // Primeira tentativa
    findPhantom();

    // Polling agressivo
    checkInterval = setInterval(() => {
      attempts++;
      const found = findPhantom();
      if (found || attempts > 10) {
        if (!found) console.warn("❌ [DEBUG] Phantom não encontrada após 10 tentativas.");
        clearInterval(checkInterval);
        setLoading(false);
      }
    }, 500);

    return () => clearInterval(checkInterval);
  }, []);

  const fetchProfile = async (address) => {
    console.log("📥 [DEBUG] Buscando perfil no Supabase para:", address);
    try {
      const { data, error } = await supabase
        .from('perfil_mineiro')
        .select('*')
        .eq('id', address)
        .single();

      if (error && error.code === 'PGRST116') {
        console.log("🆕 [DEBUG] Perfil não existe. Criando novo...");
        const { data: newProfile, error: insError } = await supabase
          .from('perfil_mineiro')
          .insert([{ id: address, wallet_address: address, pos_x: 500, pos_y: 500 }])
          .select().single();
        
        if (insError) console.error("❌ [DEBUG] Erro ao criar perfil:", insError);
        setProfileData(newProfile);
      } else {
        console.log("📊 [DEBUG] Perfil carregado:", data);
        setProfileData(data);
      }
    } catch (e) {
      console.error("💥 [DEBUG] Erro fatal no FetchProfile:", e);
    }
  };

  const connectWallet = async () => {
    console.log("🖱️ [DEBUG] Botão Conectar clicado.");
    try {
      if (!window?.solana?.isPhantom) {
        console.error("❌ [DEBUG] Clique falhou: window.solana não existe.");
        window.open("https://phantom.app", "_blank");
        return;
      }
      
      const resp = await window.solana.connect();
      const address = resp.publicKey.toString();
      console.log("🎯 [DEBUG] Conectado manualmente:", address);
      setUser(address);
      await fetchProfile(address);
    } catch (err) {
      console.error("🚫 [DEBUG] Conexão rejeitada pelo usuário:", err);
    }
  };

  const disconnectWallet = async () => {
    console.log("🔌 [DEBUG] Desconectando...");
    if (window.solana) await window.solana.disconnect();
    setUser(null);
    setProfileData(null);
  };

  return (
    <AuthContext.Provider value={{ user, profileData, loading, hasPhantom, connectWallet, disconnectWallet }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
