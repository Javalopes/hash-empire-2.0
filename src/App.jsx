
import React from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';

function GameContent() {
  const { user, loading, connectWallet, disconnectWallet, hasPhantom } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-cyan-400 font-mono italic">
      SINCRO_NUCLEO_V2...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 font-mono text-cyan-400">
      {!user ? (
        <div className="flex flex-col items-center gap-12 animate-in fade-in duration-700">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
            HASH EMPIRE
          </h1>
          <button 
            onClick={() => connectWallet()}
            className={`px-12 py-6 border-2 ${hasPhantom ? 'border-cyan-400 text-cyan-400' : 'border-amber-500 text-amber-500'} font-bold uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition-all shadow-lg active:scale-95`}
          >
            {hasPhantom ? 'CONECTAR PHANTOM' : 'INSTALAR PHANTOM'}
          </button>
        </div>
      ) : (
        <div className="bg-black/60 border-2 border-cyan-500/30 p-10 backdrop-blur-xl shadow-2xl rounded-sm w-full max-w-md">
          <div className="flex justify-between items-start mb-10">
            <div className="border-l-4 border-cyan-400 pl-4">
              <p className="text-[10px] text-cyan-600 uppercase tracking-widest font-bold">Acesso Autorizado</p>
              <p className="text-white text-xs truncate w-40 mt-1">{user}</p>
            </div>
            <button 
              onClick={() => disconnectWallet()}
              className="text-[10px] text-red-500 border border-red-500/20 px-2 py-1 hover:bg-red-500 hover:text-white transition-all"
            >
              SAIR
            </button>
          </div>
          <button className="w-full py-6 bg-cyan-500 text-black font-black uppercase tracking-[0.4em] text-lg hover:bg-white transition-all shadow-[0_0_30px_rgba(6,182,212,0.5)]">
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

