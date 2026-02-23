import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase.js';

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
      const isPhantomInstalled = window?.solana?.isPhantom;
      
      if (isPhantomInstalled) {
        console.log("✅ [DEBUG] PHANTOM DETECTADA!");
        setHasPhantom(true);
        if (checkInterval) clearInterval(checkInterval);

        try {
          // Tenta reconectar silenciosamente
          const resp = await window.solana.connect({ onlyIfTrusted: true });
          const address = resp.publicKey.toString();
          console.log("👤 [DEBUG] Auto-login:", address);
          setUser(address);
          await fetchProfile(address);
        } catch (err) {
          console.log("ℹ️ [DEBUG] Sem auto-login (Clique manual necessário)");
        }
        setLoading(false);
        return true;
      }
      return false;
    };

    findPhantom();

    checkInterval = setInterval(() => {
      attempts++;
      if (findPhantom() || attempts > 10) {
        clearInterval(checkInterval);
        setLoading(false);
      }
    }, 500);

    return () => clearInterval(checkInterval);
  }, []);

  const fetchProfile = async (address) => {
    console.log("📥 [DEBUG] Buscando perfil para ID:", address);
    try {
      // USAR maybeSingle() para evitar erro 406 se o perfil não existir
      const { data, error } = await supabase
        .from('perfil_mineiro')
        .select('*')
        .eq('id', address)
        .maybeSingle();

      if (error) {
        console.error("❌ [DEBUG] Erro na busca:", error.message);
        return;
      }

      if (!data) {
        console.log("🆕 [DEBUG] Perfil inexistente. Criando registo...");
        const { data: newProfile, error: insError } = await supabase
          .from('perfil_mineiro')
          .insert([{ 
            id: address, 
            wallet_address: address, 
            pos_x: 500, 
            pos_y: 500,
            saldo_tokens: 0 
          }])
          .select()
          .single();
        
        if (insError) {
          console.error("❌ [DEBUG] Erro ao criar perfil:", insError.message);
        } else {
          setProfileData(newProfile);
        }
      } else {
        console.log("📊 [DEBUG] Perfil carregado com sucesso.");
        setProfileData(data);
      }
    } catch (e) {
      console.error("💥 [DEBUG] Erro fatal no AuthContext:", e);
    }
  };

  const connectWallet = async () => {
    console.log("🖱️ [DEBUG] Clique Conectar Wallet.");
    try {
      if (!window?.solana?.isPhantom) {
        window.open("https://phantom.app", "_blank");
        return;
      }
      const resp = await window.solana.connect();
      const address = resp.publicKey.toString();
      setUser(address);
      await fetchProfile(address);
    } catch (err) {
      console.error("🚫 [DEBUG] Conexão rejeitada:", err);
    }
  };

  const disconnectWallet = async () => {
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
