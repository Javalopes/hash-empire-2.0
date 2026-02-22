import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPhantom, setHasPhantom] = useState(false);

  // 1. Detetar a extensão de forma agressiva
  useEffect(() => {
    const checkPhantom = () => {
      if (window?.solana?.isPhantom) {
        setHasPhantom(true);
        // Tenta reconectar automaticamente se já houver permissão
        window.solana.connect({ onlyIfTrusted: true })
          .then(({ publicKey }) => {
            const address = publicKey.toString();
            setUser(address);
            fetchProfile(address);
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      } else {
        // Se não encontrou, tenta novamente em 500ms (máx 5 vezes)
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (window?.solana?.isPhantom) {
            setHasPhantom(true);
            setLoading(false);
            clearInterval(interval);
          }
          if (attempts > 5) {
            setLoading(false);
            clearInterval(interval);
          }
        }, 500);
      }
    };

    checkPhantom();
  }, []);

  const fetchProfile = async (address) => {
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
  };

  const connectWallet = async () => {
    try {
      if (!window?.solana?.isPhantom) {
        window.open("https://phantom.app", "_blank");
        return;
      }
      const { publicKey } = await window.solana.connect();
      const address = publicKey.toString();
      setUser(address);
      await fetchProfile(address);
    } catch (err) {
      console.error("Erro na conexão:", err);
    }
  };

  const disconnectWallet = () => {
    setUser(null);
    setProfileData(null);
    if (window.solana) window.solana.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, profileData, loading, hasPhantom, connectWallet, disconnectWallet }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
