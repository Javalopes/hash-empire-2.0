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
