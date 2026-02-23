
import React, { useState } from 'react';
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
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    await connectWallet();
    setIsConnecting(false);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#020617] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {!user ? (
        <div className="flex flex-col items-center gap-20 animate-in fade-in zoom-in duration-1000">
          {/* Título com Efeito de Varredura (Scanline) */}
          <div className="text-center relative group">
            <h1 className="text-cyan-400 text-7xl md:text-9xl font-black tracking-tighter uppercase italic select-none drop-shadow-[0_0_25px_rgba(6,182,212,0.7)] leading-none transition-all duration-500 group-hover:drop-shadow-[0_0_40px_rgba(6,182,212,1)]">
              Hash Empire
            </h1>
            <div className="h-[3px] w-full bg-cyan-500 mt-4 shadow-[0_0_15px_rgba(6,182,212,1)] animate-pulse" />
            <p className="text-cyan-500/40 font-mono text-[11px] tracking-[1.3em] mt-6 uppercase font-bold">
              Autonomous Mining Protocol
            </p>
          </div>

          <div className="flex flex-col items-center gap-8">
            <button 
              onClick={handleConnect}
              disabled={isConnecting}
              className={`group relative px-20 py-10 bg-black/40 border-2 ${hasPhantom ? 'border-cyan-400 text-cyan-400' : 'border-amber-500 text-amber-500'} font-black uppercase tracking-[0.5em] transition-all duration-300 active:scale-95 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:shadow-[0_0_60px_rgba(6,182,212,0.5)] disabled:opacity-50`}
            >
              <span className="relative z-10 text-2xl drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                {isConnecting ? 'A PROCESSAR...' : hasPhantom ? 'CONECTAR PHANTOM' : 'INSTALAR PHANTOM'}
              </span>
              
              {/* Efeito de Brilho que atravessa o botão */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
              
              {/* Fundo que sobe */}
              <div className={`absolute inset-0 ${hasPhantom ? 'bg-cyan-500' : 'bg-amber-600'} transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0`} />
              <style dangerouslySetInnerHTML={{__html: '.group:hover span { color: black; text-shadow: none; }'}} />
            </button>
            
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${hasPhantom ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]' : 'bg-red-500'} animate-pulse`} />
              <span className="text-cyan-900 font-mono text-[10px] uppercase tracking-widest">
                Status: {hasPhantom ? 'Interface de Wallet Detetada' : 'Erro de Comunicação com Extensão'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Painel de Controlo do Jogador */
        <div className="w-full max-w-lg bg-black/80 border-2 border-cyan-500/50 p-12 backdrop-blur-3xl shadow-[0_0_120px_rgba(0,0,0,1)] rounded-none relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)]" />
          
          <div className="flex justify-between items-start mb-16">
            <div className="border-l-4 border-cyan-400 pl-6">
              <h2 className="text-cyan-600 text-[10px] font-mono uppercase tracking-[0.4em] font-black mb-2">Sessão_Autorizada</h2>
              <p className="text-white font-mono text-sm truncate w-56 tracking-tighter opacity-80">{user}</p>
            </div>
            <button 
              onClick={disconnectWallet} 
              className="text-[10px] text-red-500 border border-red-500/40 px-5 py-2 hover:bg-red-600 hover:text-white transition-all font-black uppercase"
            >
              Desligar
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-16">
            <div className="bg-cyan-950/20 p-8 border border-cyan-500/10 group hover:border-cyan-400/40 transition-colors">
              <p className="text-cyan-800 text-[10px] uppercase font-black mb-3 tracking-widest">Tokens_HASH</p>
              <p className="text-cyan-400 font-mono text-5xl font-bold drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                {profileData?.saldo_tokens || 0}
              </p>
            </div>
            <div className="bg-slate-900/40 p-8 border border-white/5 group hover:border-white/20 transition-colors">
              <p className="text-slate-700 text-[10px] uppercase font-black mb-3 tracking-widest">Nível_Rank</p>
              <p className="text-white font-mono text-5xl font-bold">{profileData?.xp || 0}</p>
            </div>
          </div>

          <button className="w-full py-8 bg-cyan-500 text-black font-black uppercase tracking-[0.7em] text-xl hover:bg-white hover:shadow-[0_0_50px_rgba(255,255,255,0.8)] transition-all duration-500 shadow-2xl relative group overflow-hidden">
            <span className="relative z-10">Entrar na Cidade</span>
            <div className="absolute inset-0 bg-white/40 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
          </button>
        </div>
      )}

      {/* Linha de Código Decorativa */}
      <div className="fixed bottom-8 right-8 text-[9px] text-cyan-950 font-mono uppercase tracking-[0.5em] hidden lg:block">
        [ SYSTEM_REBOOT_SUCCESSFUL // STABLE_BUILD_2.1.8 ]
      </div>
    </div>
  );
}

