import React, { createContext, useContext, useState, useEffect } from 'react'; // OBRIGATÓRIO
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
      console.log(`🔎 [DEBUG] Tentativa ${attempts} de encontrar Phantom...`);
      
      const isPhantomInstalled = window?.solana?.isPhantom;
      
      if (isPhantomInstalled) {
        console.log("✅ [DEBUG] PHANTOM DETECTADA!");
        setHasPhantom(true);
        if (checkInterval) clearInterval(checkInterval);

        try {
          console.log("📡 [DEBUG] Tentando conexão automática...");
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
    console.log("📥 [DEBUG] Buscando perfil:", address);
    try {
      const { data, error } = await supabase
        .from('perfil_mineiro')
        .select('*')
        .eq('id', address)
        .single();

      if (error && error.code === 'PGRST116') {
        const { data: newProfile } = await supabase
          .from('perfil_mineiro')
          .insert([{ id: address, wallet_address: address, pos_x: 500, pos_y: 500 }])
          .select().single();
        setProfileData(newProfile);
      } else {
        setProfileData(data);
      }
    } catch (e) {
      console.error("💥 [DEBUG] Erro Fetch:", e);
    }
  };

  const connectWallet = async () => {
    console.log("🖱️ [DEBUG] Clique Conectar.");
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
      console.error("🚫 [DEBUG] Rejeitado:", err);
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
