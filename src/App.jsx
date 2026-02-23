import React, { useState } from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import GameStage from './components/game/core/GameStage.jsx';
import useLand from './hooks/useLand.js';

function GameContent() {
  const { user, loading, connectWallet, disconnectWallet, profileData, hasPhantom } = useAuth();
  const [started, setStarted] = useState(false);
  // Pega posição do mineiro
  const mineiroPos = profileData ? { x: Number(profileData.pos_x), y: Number(profileData.pos_y) } : null;
  const { currentLote, loading: loteLoading } = useLand(mineiroPos);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center font-mono text-cyan-400 animate-pulse tracking-[0.5em]">
      SINCRO_SISTEMA_V2...
    </div>
  );

  if (started && user) return <GameStage />;
  if (started && user) return (
    <>
      {/* HUD do Terreno */}
      <div className="fixed top-4 right-4 z-50 bg-slate-900/90 border-2 border-cyan-400 rounded-lg p-6 shadow-lg min-w-[260px]">
        <h3 className="text-cyan-400 text-lg font-bold mb-2">INFO DO TERRENO</h3>
        {loteLoading ? (
          <div className="text-white text-xs">A carregar...</div>
        ) : currentLote ? (
          <>
            <div className="text-white text-sm mb-1">LOTE: <span className="text-cyan-300">{currentLote.coord_x}, {currentLote.coord_y}</span></div>
            <div className="text-white text-sm mb-1">STATUS: <span className="text-cyan-300">{currentLote.status}</span></div>
            <div className="text-white text-sm mb-1">PREÇO: <span className="text-cyan-300">{currentLote.price} HASH</span></div>
            <div className="text-white text-sm mb-3">DONO: <span className="text-cyan-300">{currentLote.owner || '---'}</span></div>
            {currentLote.status === 'disponivel' && (
              <button className="bg-cyan-400 text-black font-bold px-4 py-2 rounded border border-cyan-400 hover:bg-cyan-300 transition">REIVINDICAR LOTE</button>
            )}
          </>
        ) : (
          <div className="text-white text-xs">Sem dados do lote.</div>
        )}
      </div>
      <GameStage />
    </>
  );

  return (
    <div className="min-h-screen bg-[#020617] relative flex flex-col items-center justify-center p-6 font-mono overflow-hidden">
      {/* CAMADA DE FUNDO: Grelha Ciberpunk */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:45px_45px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      {/* CAMADA DE FUNDO: Scanlines (Efeito de Monitor) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]" />

      {!user ? (
        <div className="flex flex-col items-center gap-16 animate-in fade-in zoom-in duration-1000 relative z-10">
          <div className="text-center relative">
            <h1 className="text-cyan-400 text-7xl md:text-9xl font-black tracking-tighter uppercase italic select-none drop-shadow-[0_0_25px_rgba(6,182,212,0.8)] leading-none mb-4">
              Hash Empire
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(6,182,212,1)]" />
            <p className="text-cyan-400/50 text-[10px] tracking-[1.2em] mt-6 uppercase font-bold">
              Protocolo de Mineração Ciberpunk
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={() => connectWallet()}
              className={`group relative px-16 py-8 border-2 transition-all duration-500 active:scale-95 overflow-hidden font-black uppercase tracking-[0.4em] ${hasPhantom ? 'border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.7)]' : 'border-amber-500 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]'}`}
            >
              <span className="relative z-10 text-xl font-black">
                {hasPhantom ? 'Conectar Phantom' : 'Instalar Phantom'}
              </span>
              <div className={`absolute inset-0 ${hasPhantom ? 'bg-cyan-400' : 'bg-amber-500'} transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0`} />
              <style dangerouslySetInnerHTML={{__html: '.group:hover span { color: black; }'}} />
            </button>
            <p className="text-cyan-900 text-[9px] uppercase tracking-[0.5em] animate-pulse">Link Neural Disponível</p>
          </div>
        </div>
      ) : (
        /* PAINEL DE CONTROLO DO JOGADOR */
        <div className="w-full max-w-md bg-black/80 border-2 border-cyan-500/40 p-10 backdrop-blur-2xl shadow-[0_0_100px_rgba(0,0,0,1)] rounded-sm relative animate-in zoom-in-95 duration-500 z-10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(6,182,212,1)]" />
          <div className="flex justify-between items-start mb-10">
            <div className="border-l-4 border-cyan-400 pl-5">
              <h2 className="text-cyan-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">ID_AUTORIZADO</h2>
              <p className="text-white font-mono text-xs truncate w-40 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{user}</p>
            </div>
            <button 
              onClick={() => disconnectWallet()} 
              className="text-[9px] text-red-500 border border-red-500/30 px-3 py-1.5 hover:bg-red-500 hover:text-white transition-all uppercase font-black tracking-tighter"
            >
              Desconectar
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="bg-cyan-950/20 p-6 border border-cyan-500/10">
              <p className="text-cyan-800 text-[9px] uppercase font-black mb-2 tracking-widest">Saldo_HASH</p>
              <p className="text-cyan-400 text-3xl font-bold drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                {profileData?.saldo_tokens || 0}
              </p>
            </div>
            <div className="bg-slate-900/40 p-6 border border-white/5 text-right">
              <p className="text-slate-600 text-[9px] uppercase font-black mb-2 tracking-widest">Nível_Exp</p>
              <p className="text-white text-3xl font-bold">{profileData?.xp || 0}</p>
            </div>
          </div>
          <button
            className="w-full py-6 bg-cyan-500 text-black font-black uppercase tracking-[0.6em] text-lg hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.8)] transition-all duration-300 shadow-2xl relative overflow-hidden group"
            onClick={() => setStarted(true)}
          >
            <span className="relative z-10">Iniciar Incursão</span>
            <div className="absolute inset-0 bg-white/30 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
          </button>
        </div>
      )}
      {/* FOOTER DECORATIVO */}
      <div className="fixed bottom-6 text-[9px] text-cyan-950 font-mono uppercase tracking-[1em] animate-pulse z-10">
        Terminal_v2.1.8 // Stable_Build
      </div>
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
