import React from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';

function GameContent() {
  const auth = useAuth(); // Chamada bruta para evitar desestruturação errada

  if (auth.loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-400 font-mono">
      SINCRO_NUCLEO_V2...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 font-mono">
      {!auth.user ? (
        <div className="flex flex-col items-center gap-12">
          <h1 className="text-cyan-400 text-6xl md:text-8xl font-black italic drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">
            Hash Empire
          </h1>
          <button 
            onClick={() => auth.connectWallet()} // Usando auth. para garantir que é a função do context
            className="px-12 py-6 border-2 border-cyan-400 text-cyan-400 font-bold uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition-all"
          >
            {auth.hasPhantom ? 'CONECTAR PHANTOM' : 'INSTALAR PHANTOM'}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md bg-black/60 border-2 border-cyan-500/40 p-10 backdrop-blur-2xl text-cyan-400">
          <div className="flex justify-between mb-8">
            <div className="truncate w-40 text-xs">{auth.user}</div>
            <button onClick={() => auth.disconnectWallet()} className="text-red-500 text-[10px] border border-red-500/30 px-2 py-1">SAIR</button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-10">
             <div className="bg-cyan-950/20 p-4 border border-cyan-500/10 text-center">
                <p className="text-[9px] uppercase">Saldo</p>
                <p className="text-2xl font-bold">{auth.profileData?.saldo_tokens || 0}</p>
             </div>
             <div className="bg-cyan-950/20 p-4 border border-cyan-500/10 text-center">
                <p className="text-[9px] uppercase">XP</p>
                <p className="text-2xl font-bold">{auth.profileData?.xp || 0}</p>
             </div>
          </div>
          <button className="w-full py-6 bg-cyan-500 text-black font-black uppercase tracking-[0.5em] hover:bg-white transition-all">
            INICIAR INCURSÃO
          </button>
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
