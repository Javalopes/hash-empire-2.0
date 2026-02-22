import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const connectWallet = async () => {
    try {
      setLoading(true);
      const { solana } = window;

      if (!solana?.isPhantom) {
        alert("Instala a Phantom Wallet em https://phantom.app");
        return;
      }

      const response = await solana.connect();
      const walletAddress = response.publicKey.toString();
      
      const { data, error } = await supabase
        .from('perfil_mineiro')
        .select('*')
        .eq('id', walletAddress)
        .single();

      if (error && error.code === 'PGRST116') {
        const { data: newProfile } = await supabase
          .from('perfil_mineiro')
          .insert([{ 
            id: walletAddress, 
            wallet_address: walletAddress,
            pos_x: 500, 
            pos_y: 500,
            saldo_tokens: 0 
          }])
          .select()
          .single();
        setProfileData(newProfile);
      } else {
        setProfileData(data);
      }

      setUser(walletAddress);
    } catch (err) {
      console.error("Erro ao conectar wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setUser(null);
    setProfileData(null);
    if (window.solana) window.solana.disconnect();
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, profileData, loading, connectWallet, disconnectWallet }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
