import React from 'react';
import { useAuth } from './lib/AuthContext.jsx';

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center font-mono">
    <div className="text-cyan-400 text-2xl animate-pulse tracking-[0.7em] drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
      INICIALIZANDO_NUCLEO...
    </div>
  </div>
);

export default function App() {
  const { user, loading, connectWallet, disconnectWallet, profileData, hasPhantom } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#020617] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black flex flex-col items-center justify-center p-6 selection:bg-cyan-500/30 overflow-hidden">
      
      {!user ? (
        <div className="flex flex-col items-center gap-16 animate-in fade-in zoom-in duration-1000">
          {/* Título com Glow Absurdo */}
          <div className="text-center relative">
            <h1 className="text-cyan-400 text-6xl md:text-9xl font-black tracking-tighter uppercase italic select-none drop-shadow-[0_5px_30px_rgba(6,182,212,0.8)] leading-none">
              Hash Empire
            </h1>
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-4 opacity-50 shadow-[0_0_10px_rgba(6,182,212,1)]" />
            <p className="text-cyan-400/60 font-mono text-[10px] tracking-[1.2em] mt-6 uppercase font-bold">
              Protocolo de Mineração Ciberpunk
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={connectWallet}
              className={`group relative px-16 py-8 bg-transparent border-2 ${hasPhantom ? 'border-cyan-400 text-cyan-400' : 'border-amber-500 text-amber-500'} font-black uppercase tracking-[0.4em] transition-all duration-500 active:scale-95 overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)]`}
            >
              <span className="relative z-10 text-xl">
                {hasPhantom ? 'Conectar Phantom' : 'Instalar Phantom'}
              </span>
              {/* Efeito de preenchimento ao passar o rato */}
              <div className={`absolute inset-0 ${hasPhantom ? 'bg-cyan-400' : 'bg-amber-500'} transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0`} />
              <style dangerouslySetInnerHTML={{__html: '.group:hover span { color: black; }'}} />
            </button>
            
            <p className="text-cyan-900 font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse">
              {hasPhantom ? 'Link Neural Disponível' : 'Extensão não detetada'}
            </p>
          </div>
        </div>
      ) : (
        /* UI de Jogador com Botão de Desconectar */
        <div className="w-full max-w-md bg-black/60 border-2 border-cyan-500/30 p-10 backdrop-blur-2xl shadow-[0_0_100px_rgba(0,0,0,0.9)] rounded-sm relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          
          <div className="flex justify-between items-start mb-12">
            <div className="border-l-4 border-cyan-400 pl-5">
              <h2 className="text-cyan-500 text-[10px] font-mono uppercase tracking-[0.3em] font-bold mb-1">ID_AUTORIZADO</h2>
              <p className="text-white font-mono text-xs truncate w-40 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{user}</p>
            </div>
            {/* Botão de Desconectar Carteira */}
            <button 
              onClick={disconnectWallet} 
              className="text-[9px] text-red-500 border border-red-500/30 px-3 py-1.5 hover:bg-red-500 hover:text-white transition-all uppercase font-black tracking-tighter"
            >
              Desconectar
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-cyan-950/20 p-6 border border-cyan-500/10">
              <p className="text-cyan-800 text-[9px] uppercase font-black mb-2 tracking-widest">Saldo_HASH</p>
              <p className="text-cyan-400 font-mono text-4xl font-bold drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                {profileData?.saldo_tokens || 0}
              </p>
            </div>
            <div className="bg-slate-900/40 p-6 border border-white/5">
              <p className="text-slate-600 text-[9px] uppercase font-black mb-2 tracking-widest">Nível_Exp</p>
              <p className="text-white font-mono text-4xl font-bold">{profileData?.xp || 0}</p>
            </div>
          </div>

          <button className="w-full py-6 bg-cyan-500 text-black font-black uppercase tracking-[0.6em] text-lg hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.8)] transition-all duration-300 shadow-2xl relative overflow-hidden group">
            <span className="relative z-10">Iniciar Incursão</span>
            <div className="absolute inset-0 bg-white/30 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
          </button>
        </div>
      )}

      <div className="fixed bottom-6 text-[9px] text-cyan-900 font-mono uppercase tracking-[1em] animate-pulse">
        Encrypted_Terminal_Stable // v2.1.5
      </div>
    </div>
  );
}
