import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPhantom, setHasPhantom] = useState(false);

  // Sistema de deteção 2026 (Oficial Solana)
  useEffect(() => {
    const getProvider = () => {
      if ('solana' in window) {
        const provider = window.solana;
        if (provider.isPhantom) {
          setHasPhantom(true);
          return provider;
        }
      }
      return null;
    };

    const init = async () => {
      const provider = getProvider();
      if (provider) {
        try {
          // Tenta reconectar se o utilizador já confiou no site
          const resp = await provider.connect({ onlyIfTrusted: true });
          const address = resp.publicKey.toString();
          setUser(address);
          await fetchProfile(address);
        } catch (err) {
          // Utilizador não está logado ou não confia, ignorar erro
        }
      }
      setLoading(false);
    };

    // Aguarda o carregamento total da página para a extensão injetar
    if (document.readyState === 'complete') {
      init();
    } else {
      window.addEventListener('load', init);
      return () => window.removeEventListener('load', init);
    }
  }, []);

  const fetchProfile = async (address) => {
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
      console.error("Erro ao buscar perfil:", e);
    }
  };

  const connectWallet = async () => {
    try {
      const provider = window?.solana;
      if (!provider) {
        window.open("https://phantom.app", "_blank");
        return;
      }
      const resp = await provider.connect();
      const address = resp.publicKey.toString();
      setUser(address);
      await fetchProfile(address);
    } catch (err) {
      console.error("Conexão rejeitada:", err);
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
