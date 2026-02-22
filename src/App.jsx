import React from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';

export default function App() {
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400 font-mono">
      A CARREGAR SISTEMA...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-8 p-4">
      <h1 className="text-cyan-400 text-5xl font-mono animate-pulse tracking-tighter border-b-2 border-cyan-900 pb-4">
        HASH EMPIRE V2.0
      </h1>
      
      {!user ? (
        <button 
          onClick={signInWithGoogle}
          className="px-8 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)] active:scale-95"
        >
          CONECTAR WALLET (GOOGLE)
        </button>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-white font-mono uppercase tracking-widest">Acesso Autorizado: {user.email}</p>
          <div className="w-64 h-2 bg-cyan-900 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-cyan-400 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';

function Main() {
  const { session, loading } = useAuth();
  const user = session?.user;
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400 font-mono">
        <h1>A CARREGAR...</h1>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <h1 className="text-cyan-400 text-4xl font-mono mb-8">HASH EMPIRE</h1>
        <button
          className="px-8 py-4 text-neon-pink font-mono text-2xl bg-cyan-900 rounded shadow-lg animate-pulse border-2 border-cyan-400 hover:bg-cyan-700 transition"
          onClick={() => window.open('/auth', '_self')}
        >
          CONECTAR WALLET
        </button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400 font-mono">
      <h1>BEM-VINDO AO IMPÉRIO</h1>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}
