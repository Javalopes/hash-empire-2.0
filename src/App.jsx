import React from 'react';
import { useAuth } from './lib/AuthContext';

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center font-mono">
    <div className="text-cyan-400 text-2xl animate-pulse tracking-[0.7em] drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
      SINCRO_NUCLEO_V2
    </div>
  </div>
);

export default function App() {
  const { user, loading, connectWallet, disconnectWallet, profileData, hasPhantom } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#020617] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black flex flex-col items-center justify-center p-6 selection:bg-cyan-500/30">
      
      {!user ? (
        <div className="flex flex-col items-center gap-16 animate-in fade-in zoom-in duration-1000">
          <div className="text-center relative">
            <h1 className="text-cyan-400 text-6xl md:text-9xl font-black tracking-tighter uppercase italic select-none drop-shadow-[0_5px_20px_rgba(6,182,212,0.8)] leading-none">
              Hash Empire
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-4 opacity-50" />
            <p className="text-cyan-400/60 font-mono text-[10px] tracking-[1.2em] mt-4 uppercase font-bold">
              Protocolo de Mineração Ciberpunk
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={connectWallet}
              className={`group relative px-16 py-8 bg-transparent border-2 ${hasPhantom ? 'border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'border-amber-500 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]'} font-black uppercase tracking-[0.4em] hover:shadow-[0_0_50px_rgba(6,182,212,0.9)] transition-all duration-500 active:scale-95 overflow-hidden`}
            >
              <span className="relative z-10 text-xl">
                {hasPhantom ? 'Conectar Phantom' : 'Instalar Phantom'}
              </span>
              <div className={`absolute inset-0 ${hasPhantom ? 'bg-cyan-400' : 'bg-amber-500'} transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0`} />
              <style dangerouslySetInnerHTML={{__html: '.group:hover span { color: black; }'}} />
            </button>
            
            {!hasPhantom && (
              <p className="text-amber-500/70 font-mono text-[9px] uppercase tracking-widest animate-pulse">
                Extensão não detetada no navegador
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-black/60 border-2 border-cyan-500/40 p-10 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          
          <div className="flex justify-between items-start mb-12">
            <div className="border-l-4 border-cyan-400 pl-5">
              <h2 className="text-cyan-500 text-[10px] font-mono uppercase tracking-[0.3em] font-bold mb-1">Mineiro_Logado</h2>
              <p className="text-white font-mono text-sm truncate w-44 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{user}</p>
            </div>
            <button 
              onClick={disconnectWallet} 
              className="text-[10px] text-red-500 border border-red-500/40 px-4 py-2 hover:bg-red-500 hover:text-white transition-all uppercase font-black tracking-tighter"
            >
              Sair
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-cyan-950/20 p-6 border border-cyan-500/10 rounded-sm">
              <p className="text-cyan-700 text-[10px] uppercase font-black mb-2 tracking-widest">Saldo_HASH</p>
              <p className="text-cyan-300 font-mono text-4xl font-bold drop-shadow-[0_0_10px_rgba(103,232,249,0.4)]">
                {profileData?.balance || 0}
              </p>
            </div>
            <div className="bg-slate-900/40 p-6 border border-white/5 rounded-sm">
              <p className="text-slate-600 text-[10px] uppercase font-black mb-2 tracking-widest">Nível_Exp</p>
              <p className="text-white font-mono text-4xl font-bold">{profileData?.level || 1}</p>
            </div>
          </div>

          <button className="w-full py-6 bg-cyan-500 text-black font-black uppercase tracking-[0.5em] text-lg hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all duration-300 shadow-2xl relative group overflow-hidden">
            <span className="relative z-10">Iniciar Incursão</span>
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
          </button>
        </div>
      )}

      <div className="fixed bottom-6 text-[9px] text-cyan-900 font-mono uppercase tracking-[1em] animate-pulse">
        Encrypted_Connection_Stable // v2.1.0
      </div>
    </div>
  );
}
