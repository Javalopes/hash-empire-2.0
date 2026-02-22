import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPhantom, setHasPhantom] = useState(false);

  useEffect(() => {
    let checkInterval;
    let attempts = 0;

    const findPhantom = async () => {
      // 1. Tentar encontrar o provider
      const provider = window?.solana?.isPhantom ? window.solana : null;

      if (provider) {
        console.log("PHANTOM DETETADA!");
        setHasPhantom(true);
        clearInterval(checkInterval);

        try {
          // Tenta reconectar silenciosamente se já for confiável
          const resp = await provider.connect({ onlyIfTrusted: true });
          const address = resp.publicKey.toString();
          setUser(address);
          await fetchProfile(address);
        } catch (err) {
          // Não era confiável, ignorar
        }
        setLoading(false);
        return true;
      }
      return false;
    };

    // 2. Tentar imediatamente
    findPhantom();

    // 3. Se não encontrou, tenta a cada 500ms durante 3 segundos
    checkInterval = setInterval(() => {
      attempts++;
      const found = findPhantom();
      if (found || attempts > 6) {
        clearInterval(checkInterval);
        setLoading(false);
      }
    }, 500);

    return () => clearInterval(checkInterval);
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
    } catch (e) { console.error(e); }
  };

  const connectWallet = async () => {
    try {
      if (!window?.solana?.isPhantom) {
        window.open("https://phantom.app", "_blank");
        return;
      }
      const resp = await window.solana.connect();
      const address = resp.publicKey.toString();
      setUser(address);
      await fetchProfile(address);
    } catch (err) { console.error("Rejeitado", err); }
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
