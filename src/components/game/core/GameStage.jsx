import React, { useState, useEffect } from 'react';
import useLand from '../../../hooks/useLand';
import { Stage, Container } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';
import useGameSync from '../../../hooks/useGameSync.js';
import BackgroundLayer from '../layers/BackgroundLayer.jsx';
import LandLayer from '../layers/LandLayer.jsx';
import MultiplayerLayer from '../layers/MultiplayerLayer.jsx';
import EntityLayer from '../layers/EntityLayer.jsx';

export default function GameStage() {
  const MAP_SIZE = 5000;
  const { user, profileData } = useAuth();
  const { otherPlayers, enviarPosicao } = useGameSync(user);

  // Câmara inicia onde o jogador está
  const [camPos, setCamPos] = useState({ 
    x: profileData?.pos_x || 500, 
    y: profileData?.pos_y || 500 
  });
  const [livePos, setLivePos] = useState({ x: profileData?.pos_x || 500, y: profileData?.pos_y || 500 });

  const { currentLote, reivindicar, loading } = useLand(livePos);

  const [targetPos, setTargetPos] = useState(null);
  // Estado de view para HUD
  const [view, setView] = useState('mapa');

    const handleStageClick = (e) => {
    // IMPORTANTE: Coordenada do clique + Deslocamento da Câmara
    let worldX = e.nativeEvent.offsetX + (camPos.x - window.innerWidth / 2);
    let worldY = e.nativeEvent.offsetY + (camPos.y - window.innerHeight / 2);

    // Clamp para os limites do mundo
    worldX = Math.max(0, Math.min(MAP_SIZE, worldX));
    worldY = Math.max(0, Math.min(MAP_SIZE, worldY));

    setTargetPos({ x: worldX, y: worldY });
    };

    return (
      <div className="w-full h-screen bg-[#020617]">
        <Stage 
          width={window.innerWidth} 
          height={window.innerHeight} 
          options={{ 
            backgroundColor: 0x020617, 
            antialias: true, 
            eventMode: 'static' // <--- AQUI DENTRO DAS OPTIONS
          }}
          onPointerDown={handleStageClick}
        >
          <Container x={(window.innerWidth / 2) - camPos.x} y={(window.innerHeight / 2) - camPos.y}>
            <LandLayer playerPos={camPos} />
            <MultiplayerLayer players={otherPlayers} myId={user} />
            <BackgroundLayer />
            <EntityLayer 
              target={targetPos} 
              onMove={enviarPosicao} 
              onPositionUpdate={(x, y) => { setCamPos({ x, y }); setLivePos({ x, y }); }}
              currentLote={currentLote}
              user={user}
              onEnterEdificio={() => setView('Edificio')}
            />
          </Container>
        </Stage>
        {/* HUD do Terreno ou Interior */}
        {view === 'Edificio' ? (
          <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, pointerEvents: 'auto' }} className="bg-slate-900/90 border-2 border-yellow-400 rounded-lg p-6 shadow-lg min-w-[260px]">
            <h3 className="text-yellow-400 text-lg font-bold mb-2">INTERIOR DA EDIFICIO</h3>
            <div className="text-white text-sm mb-1">Bem-vindo ao seu edifício!</div>
            <button className="mt-4 bg-cyan-400 text-black font-bold px-4 py-2 rounded border border-cyan-400 hover:bg-cyan-300 transition" onClick={() => setView('mapa')}>SAIR</button>
          </div>
        ) : currentLote && !loading && (
          <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, pointerEvents: 'auto' }} className="bg-slate-900/90 border-2 border-cyan-400 rounded-lg p-6 shadow-lg min-w-[260px]">
            <h3 className="text-cyan-400 text-lg font-bold mb-2">INFO DO TERRENO</h3>
            <div className="text-white text-sm mb-1">LOTE: <span className="text-cyan-300">{currentLote.coord_x}, {currentLote.coord_y}</span></div>
            {/* STATUS visual */}
            {currentLote.owner_id ? (
              <div className="text-white text-sm mb-1">STATUS: <span style={{ color: '#f87171' }}>OCUPADO</span></div>
            ) : (
              <div className="text-white text-sm mb-1">STATUS: <span style={{ color: '#4ade80' }}>DISPONÍVEL</span></div>
            )}
            {/* Preço só se livre */}
            {!currentLote.owner_id && (
              <div className="text-white text-sm mb-1">PREÇO: <span className="text-cyan-300">{currentLote.price} HASH</span></div>
            )}
            {/* Dono truncado */}
            {currentLote.owner_id ? (
              <div className="text-white text-sm mb-3">DONO: <span className="text-cyan-300">{currentLote.owner_id.slice(0,6)}...{currentLote.owner_id.slice(-4)}</span></div>
            ) : null}
            {!currentLote.owner_id && currentLote.status === 'disponivel' && (
              <button
                className="bg-cyan-400 text-black font-bold px-4 py-2 rounded border border-cyan-400 hover:bg-cyan-300 transition"
                disabled={loading}
                onClick={() => reivindicar(currentLote.coord_x, currentLote.coord_y, user)}
              >
                {loading ? 'A REIVINDICAR...' : 'REIVINDICAR AGORA'}
              </button>
            )}
          </div>
        )}
      </div>
    );
}
