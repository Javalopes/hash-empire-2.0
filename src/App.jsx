import React from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';

function GameContent() {
  const { user, loading, connectWallet, disconnectWallet, profileData, hasPhantom } = useAuth();

  console.log("🖥️ [SISTEMA] App renderizada. User:", user);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center font-mono text-cyan-400 animate-pulse">
      SINCRO_NUCLEO_V2...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black flex flex-col items-center justify-center p-6">
      {!user ? (
        <div className="flex flex-col items-center gap-12">
          <h1 className="text-cyan-400 text-6xl md:text-8xl font-black tracking-tighter uppercase italic drop-shadow-[0_5px_20px_rgba(6,182,212,0.8)]">
            Hash Empire
          </h1>
          <button 
            onClick={connectWallet}
            className="group relative px-12 py-6 border-2 border-cyan-400 text-cyan-400 font-black uppercase tracking-[0.3em] hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            {hasPhantom ? 'CONECTAR PHANTOM' : 'INSTALAR PHANTOM'}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md bg-black/60 border-2 border-cyan-500/40 p-10 backdrop-blur-2xl shadow-2xl rounded-sm">
          <div className="flex justify-between items-start mb-10">
            <div className="border-l-4 border-cyan-400 pl-4">
              <h2 className="text-cyan-500 text-[10px] font-mono uppercase">ID_AUTORIZADO</h2>
              <p className="text-white font-mono text-xs truncate w-40">{user}</p>
            </div>
            <button onClick={disconnectWallet} className="text-[10px] text-red-500 border border-red-500/30 px-3 py-1 hover:bg-red-500 hover:text-white transition-all">SAIR</button>
          </div>
          <button className="w-full py-6 bg-cyan-500 text-black font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-lg">
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
