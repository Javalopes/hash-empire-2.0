import React from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext.jsx'; // Adicionei .jsx aqui

function GameContent() {
  const { user, loading, connectWallet, hasPhantom } = useAuth();
  console.log("🖥️ [SISTEMA] App renderizada. User:", user);

  if (loading) return <div className="bg-black text-cyan-400 p-10 font-mono">A CARREGAR...</div>;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <h1 className="text-cyan-400 text-6xl font-mono mb-10">HASH EMPIRE</h1>
      {!user ? (
        <button 
          onClick={connectWallet}
          className="px-10 py-5 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all"
        >
          {hasPhantom ? 'CONECTAR PHANTOM' : 'INSTALAR PHANTOM'}
        </button>
      ) : (
        <div className="text-white">CONECTADO: {user}</div>
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
