import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from './supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    setSession(supabase.auth.session());
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      setLoading(false);
      return;
    }
    async function fetchProfile() {
      setLoading(true);
      const userId = session.user.id;
      let { data: profile, error } = await supabase
        .from('perfil_mineiro')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (!profile) {
        // Cria novo perfil
        const { data: newProfile } = await supabase
          .from('perfil_mineiro')
          .insert([{ user_id: userId, nome: session.user.email, pos_x: 500, pos_y: 500 }])
          .single();
        setProfile(newProfile);
      } else {
        setProfile(profile);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
