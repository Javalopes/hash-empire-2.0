import React from 'react';
import { useAuth } from './lib/AuthContext';

export default function App() {
  const { user, loading, connectWallet, disconnectWallet, profileData, hasPhantom } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center font-mono">
      <div className="text-cyan-400 text-xl animate-pulse tracking-[0.5em] drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
        SINCRO_NUCLEO_V2
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black flex flex-col items-center justify-center p-6 selection:bg-cyan-500/30 overflow-hidden">
      
      {/* Elemento Decorativo: Linhas de Fundo */}
      <div className="fixed inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {!user ? (
        <div className="flex flex-col items-center gap-16 animate-in fade-in zoom-in duration-1000 relative z-10">
          {/* Título com Glow e Scanline */}
          <div className="text-center relative group">
            <h1 className="text-cyan-400 text-7xl md:text-9xl font-black tracking-tighter uppercase italic select-none drop-shadow-[0_5px_25px_rgba(6,182,212,0.7)] leading-none transition-all duration-500 group-hover:drop-shadow-[0_0_40px_rgba(6,182,212,1)]">
              Hash Empire
            </h1>
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-4 shadow-[0_0_15px_rgba(6,182,212,1)]" />
            <p className="text-cyan-500/40 font-mono text-[10px] tracking-[1.3em] mt-6 uppercase font-bold">
              Autonomous Mining Protocol
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={() => connectWallet()}
              className={`group relative px-16 py-8 bg-black/40 border-2 ${hasPhantom ? 'border-cyan-400 text-cyan-400' : 'border-amber-500 text-amber-500'} font-black uppercase tracking-[0.4em] transition-all duration-300 active:scale-95 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]`}
            >
              <span className="relative z-10 text-xl">
                {hasPhantom ? 'Conectar Phantom' : 'Instalar Phantom'}
              </span>
              {/* Efeito de Fundo ao Passar o Rato */}
              <div className={`absolute inset-0 ${hasPhantom ? 'bg-cyan-400' : 'bg-amber-500'} transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0`} />
              <style dangerouslySetInnerHTML={{__html: '.group:hover span { color: black; }'}} />
            </button>
            
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${hasPhantom ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]' : 'bg-red-500'} animate-pulse`} />
              <span className="text-cyan-900 font-mono text-[10px] uppercase tracking-widest">
                {hasPhantom ? 'Link Neural Ativo' : 'Extensão não detetada'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Painel de Controlo do Jogador (Lógica preservada) */
        <div className="w-full max-w-md bg-black/80 border-2 border-cyan-500/40 p-10 backdrop-blur-2xl shadow-[0_0_100px_rgba(0,0,0,0.9)] rounded-sm relative animate-in zoom-in-95 duration-500">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(6,182,212,1)]" />
          
          <div className="flex justify-between items-start mb-12">
            <div className="border-l-4 border-cyan-400 pl-5">
              <h2 className="text-cyan-500 text-[10px] font-mono uppercase tracking-[0.3em] font-black mb-2">ID_AUTORIZADO</h2>
              <p className="text-white font-mono text-xs truncate w-40 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{user}</p>
            </div>
            <button 
              onClick={() => disconnectWallet()} 
              className="text-[9px] text-red-500 border border-red-500/30 px-3 py-1.5 hover:bg-red-500 hover:text-white transition-all uppercase font-black"
            >
              Sair
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-cyan-950/20 p-6 border border-cyan-500/10">
              <p className="text-cyan-800 text-[9px] uppercase font-black mb-2 tracking-widest">Saldo_HASH</p>
              <p className="text-cyan-400 font-mono text-4xl font-bold drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                {profileData?.saldo_tokens || 0}
              </p>
            </div>
            <div className="bg-slate-900/40 p-6 border border-white/5 text-right">
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

      {/* Footer Decorativo */}
      <div className="fixed bottom-6 text-[9px] text-cyan-950 font-mono uppercase tracking-[1em] animate-pulse">
        Encrypted_Terminal_Stable // v2.1.8
      </div>
    </div>
  );
}


