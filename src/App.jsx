import React from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';

function GameContent() {
  const { user, loading, connectWallet, disconnectWallet } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400 font-mono italic animate-pulse">
      [ SINCRO_SISTEMA_V2.0 ]
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-10 p-6 overflow-hidden">
      {/* Logo Néon */}
      <div className="relative">
        <h1 className="text-cyan-400 text-6xl font-mono tracking-tighter border-b-4 border-cyan-500/30 pb-4 z-10 relative">
          HASH EMPIRE
        </h1>
        <div className="absolute inset-0 bg-cyan-500/20 blur-3xl -z-10" />
      </div>
      
      {!user ? (
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={connectWallet}
            className="group relative px-10 py-5 bg-black border-2 border-cyan-400 text-cyan-400 font-bold uppercase tracking-[0.3em] overflow-hidden transition-all hover:bg-cyan-400 hover:text-black shadow-[0_0_30px_rgba(6,182,212,0.3)]"
          >
            <span className="relative z-10">CONECTAR PHANTOM</span>
            <div className="absolute inset-0 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left -z-0" />
          </button>
          <p className="text-cyan-900 font-mono text-[10px] uppercase">Aguardando autorização de rede...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
          <div className="bg-cyan-950/30 border border-cyan-500/50 p-6 rounded-sm text-center backdrop-blur-md">
            <p className="text-cyan-400 font-mono text-xs uppercase mb-2 tracking-widest">Acesso Autorizado</p>
            <p className="text-white font-mono text-sm break-all max-w-[250px]">{user}</p>
            <button onClick={disconnectWallet} className="mt-4 text-[10px] text-red-500/70 hover:text-red-500 uppercase tracking-tighter">Desconectar Link</button>
          </div>
          <div className="w-48 h-1 bg-cyan-900 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 bg-cyan-400 animate-[shimmer_2s_infinite] w-1/2" />
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
