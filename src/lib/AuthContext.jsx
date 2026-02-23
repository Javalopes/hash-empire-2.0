import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPhantom, setHasPhantom] = useState(false);

  useEffect(() => {
    const checkPhantom = () => {
      const solana = window?.solana;
      if (solana?.isPhantom) {
        setHasPhantom(true);
        // Tenta reconectar se já for confiável
        solana.connect({ onlyIfTrusted: true })
          .then(({ publicKey }) => {
            const address = publicKey.toString();
            setUser(address);
            fetchProfile(address);
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    };

    // Pequeno delay para garantir injeção da extensão
    const timer = setTimeout(checkPhantom, 500);
    return () => clearTimeout(timer);
  }, []);

  const fetchProfile = async (address) => {
    try {
      const { data, error } = await supabase
        .from('perfil_mineiro')
        .select('*')
        .eq('id', address)
        .maybeSingle();

      if (!data && !error) {
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
      if (!window?.solana?.isPhantom) return window.open("https://phantom.app", "_blank");
      const { publicKey } = await window.solana.connect();
      const address = publicKey.toString();
      setUser(address);
      await fetchProfile(address);
    } catch (err) { console.error(err); }
  };

  const disconnectWallet = () => {
    if (window?.solana) window.solana.disconnect();
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
