import React from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';

function GameContent() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400 font-mono">
      A CARREGAR SISTEMA...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-8 p-4">
      <h1 className="text-cyan-400 text-5xl font-mono animate-pulse tracking-tighter border-b-2 border-cyan-900 pb-4">
        HASH EMPIRE V2.0
      </h1>
      
      {!user ? (
        <button 
          onClick={signInWithGoogle}
          className="px-8 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)] active:scale-95"
        >
          CONECTAR WALLET (GOOGLE)
        </button>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-white font-mono uppercase tracking-widest">Acesso Autorizado: {user.email}</p>
          <button onClick={signOut} className="text-xs text-red-500 hover:underline">SAIR</button>
          <div className="w-64 h-2 bg-cyan-900 rounded-full overflow-hidden mt-4">
            <div className="w-1/2 h-full bg-cyan-400 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GameContent />
    </AuthProvider>
  );
}
