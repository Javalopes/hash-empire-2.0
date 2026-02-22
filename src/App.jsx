import React from 'react';
import { useAuth } from './lib/AuthContext';

// Componente de carregamento com estilo Cyberpunk
const LoadingScreen = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-mono">
    <div className="text-cyan-400 text-xl animate-pulse tracking-[0.5em] mb-4">
      [ SINCRO_SISTEMA_V2.0 ]
    </div>
    <div className="w-48 h-1 bg-cyan-900 rounded-full overflow-hidden">
      <div className="h-full bg-cyan-400 animate-[shimmer_2s_infinite] w-1/2" />
    </div>
  </div>
);

export default function App() {
  const { user, loading, connectWallet, disconnectWallet, profileData } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-cyan-500/30">
      
      {/* Se o utilizador NÃO estiver conectado */}
      {!user ? (
        <div className="flex flex-col items-center gap-12 animate-in fade-in duration-700">
          <div className="relative group">
            <h1 className="text-cyan-400 text-7xl md:text-8xl font-mono tracking-tighter border-b-4 border-cyan-500/20 pb-6 relative z-10">
              HASH EMPIRE
            </h1>
            <div className="absolute inset-0 bg-cyan-500/10 blur-3xl -z-0 group-hover:bg-cyan-500/20 transition-all" />
          </div>

          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={connectWallet}
              className="group relative px-12 py-6 bg-black border-2 border-cyan-400 text-cyan-400 font-bold uppercase tracking-[0.4em] overflow-hidden transition-all hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] active:scale-95"
            >
              <span className="relative z-10">CONECTAR PHANTOM</span>
              <div className="absolute inset-0 bg-cyan-400 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0" />
              <style dangerouslySetInnerHTML={{__html: '.group:hover span { color: black; }'}} />
            </button>
            
            <p className="text-cyan-900 font-mono text-[10px] uppercase tracking-widest animate-pulse">
              Protocolo de Autenticação Solana Ativo
            </p>
          </div>
        </div>
      ) : (
        /* Se o utilizador ESTIVER conectado */
        <div className="flex flex-col items-center gap-8 animate-in zoom-in-95 duration-500">
          <div className="bg-cyan-950/20 border border-cyan-500/30 p-8 rounded-sm backdrop-blur-xl shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-cyan-400 font-mono text-xs uppercase tracking-[0.2em] mb-1">Mineiro Autorizado</h2>
                <p className="text-white font-mono text-sm truncate w-48">{user}</p>
              </div>
              <button 
                onClick={disconnectWallet}
                className="text-[10px] text-red-500/60 hover:text-red-500 uppercase font-bold border border-red-500/20 px-2 py-1 hover:bg-red-500/10 transition-all"
              >
                Sair
              </button>
            </div>

            {/* Stats Rápidas */}
            <div className="grid grid-cols-2 gap-4 border-t border-cyan-500/20 pt-6">
              <div>
                <p className="text-cyan-900 text-[10px] uppercase font-bold">Saldo HASH</p>
                <p className="text-cyan-400 font-mono text-xl">{profileData?.balance || 0}</p>
              </div>
              <div className="text-right">
                <p className="text-cyan-900 text-[10px] uppercase font-bold">Nível</p>
                <p className="text-white font-mono text-xl">{profileData?.level || 1}</p>
              </div>
            </div>

            <button className="w-full mt-8 py-4 bg-cyan-500 text-black font-black uppercase tracking-[0.2em] hover:bg-cyan-400 transition-colors shadow-lg">
              ENTRAR NA CIDADE
            </button>
          </div>
        </div>
      )}

      {/* Footer Decorativo */}
      <div className="fixed bottom-8 left-8 text-cyan-950 font-mono text-[10px] uppercase tracking-widest hidden md:block">
        v2.0.4 // engine: pixijs + react
      </div>
    </div>
  );
}

