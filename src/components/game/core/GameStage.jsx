import React, { useState, useEffect, useMemo } from 'react';
import { Stage, Container } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';
import useLand from '../../../hooks/useLand';
import useGameSync from '../../../hooks/useGameSync.js';
import BackgroundLayer from '../layers/BackgroundLayer.jsx';
import LandLayer from '../layers/LandLayer.jsx';
import MultiplayerLayer from '../layers/MultiplayerLayer.jsx';
import EntityLayer from '../layers/EntityLayer.jsx';

export default function GameStage() {
  const MAP_SIZE = 5000;
  const { user, profileData, loading: authLoading } = useAuth();
  const { otherPlayers, enviarPosicao } = useGameSync(user);

  // 1. POSIÇÃO INICIAL (Garantida)
  const initialX = useMemo(() => Number(profileData?.pos_x || 500), [profileData]);
  const initialY = useMemo(() => Number(profileData?.pos_y || 500), [profileData]);

  const [camPos, setCamPos] = useState({ x: initialX, y: initialY });
  const [livePos, setLivePos] = useState({ x: initialX, y: initialY });
  const [targetPos, setTargetPos] = useState(null);
  const [view, setView] = useState('mapa');

  // 2. RADAR DE LOTES (Sempre atento à livePos)
  const { currentLote, reivindicar, loading: landLoading } = useLand(livePos);

  // 3. TRAVA DE IDENTIDADE (Obrigatória para o Dourado funcionar)
  if (authLoading || !user || !profileData) {
    return (
      <div className="w-full h-screen bg-[#020617] flex items-center justify-center font-mono">
        <div className="text-cyan-400 animate-pulse tracking-widest text-xs">
          ESTABELECENDO_LINK_NEURAL_SISTEMA_V2...
        </div>
      </div>
    );
  }

  const handleStageClick = (e) => {
    let worldX = e.nativeEvent.offsetX + (camPos.x - window.innerWidth / 2);
    let worldY = e.nativeEvent.offsetY + (camPos.y - window.innerHeight / 2);
    worldX = Math.max(0, Math.min(MAP_SIZE, worldX));
    worldY = Math.max(0, Math.min(MAP_SIZE, worldY));
    setTargetPos({ x: worldX, y: worldY });
  };

  return (
    <div className="w-full h-screen bg-[#020617] overflow-hidden">
      <Stage 
        width={window.innerWidth} 
        height={window.innerHeight} 
        options={{ backgroundColor: 0x020617, antialias: true, eventMode: 'static' }}
        onPointerDown={handleStageClick}
      >
        <Container x={(window.innerWidth / 2) - camPos.x} y={(window.innerHeight / 2) - camPos.y}>
          {/* CAMADAS (Ordem de profundidade: Fundo -> Lotes -> Outros -> Tu) */}
          <BackgroundLayer />
          
          {/* LandLayer recebe o USER vindo diretamente do AuthContext */}
          <LandLayer user={user} playerPos={livePos} />
          
          <MultiplayerLayer players={otherPlayers} myId={user} />
          
          <EntityLayer 
            target={targetPos} 
            onMove={enviarPosicao} 
            onPositionUpdate={(x, y) => { 
              setCamPos({ x, y }); 
              setLivePos({ x, y }); 
            }}
            currentLote={currentLote}
            user={user}
            onEnterEdificio={() => setView('Edificio')}
          />
        </Container>
      </Stage>

      {/* HUD INTERFACE (HTML/Tailwind) */}
      <div className="pointer-events-none fixed inset-0 z-[9999]">
        {view === 'Edificio' ? (
          <div className="pointer-events-auto absolute right-5 top-5 min-w-[280px] rounded-sm border-2 border-yellow-500 bg-black/90 p-6 font-mono shadow-[0_0_30px_rgba(234,179,8,0.3)]">
            <h3 className="mb-2 font-black text-yellow-500">SETOR_INTERIOR</h3>
            <p className="mb-6 text-[10px] text-white/60 uppercase italic">Bem-vindo à sua unidade de comando.</p>
            <button 
              className="w-full border border-yellow-500 py-2 text-xs font-bold text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all"
              onClick={() => setView('mapa')}
            >
              RETORNAR_AO_MAPA
            </button>
          </div>
        ) : currentLote && (
          <div className="pointer-events-auto absolute right-5 top-5 min-w-[280px] rounded-sm border-2 border-cyan-500 bg-black/90 p-6 font-mono shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <div className="mb-4 flex items-center justify-between border-b border-cyan-500/30 pb-2">
              <h3 className="font-black text-cyan-400 text-sm italic">SISTEMA_GEODESICO</h3>
              <span className="text-[10px] text-cyan-700 font-bold">{currentLote.coord_x} : {currentLote.coord_y}</span>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-[10px] uppercase">
                <span className="text-white/40 italic">Registro:</span>
                <span className={currentLote.owner_id ? "text-red-500 font-bold" : "text-green-400 font-bold"}>
                  {currentLote.owner_id ? "● OCUPADO" : "○ DISPONÍVEL"}
                </span>
              </div>
              
              {currentLote.owner_id ? (
                <div className="flex justify-between text-[10px] uppercase">
                  <span className="text-white/40 italic">Titular:</span>
                  <span className="text-cyan-200">
                    {currentLote.owner_id === user ? "TU (PROPRIETÁRIO)" : `${currentLote.owner_id.slice(0,6)}...${currentLote.owner_id.slice(-4)}`}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between text-[10px] uppercase">
                  <span className="text-white/40 italic">Valor:</span>
                  <span className="text-cyan-400 font-bold">{currentLote.price || 1000} HASH</span>
                </div>
              )}
            </div>

            {!currentLote.owner_id && (
              <button
                className="w-full bg-cyan-500 py-3 text-xs font-black text-black hover:bg-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)] disabled:opacity-50"
                disabled={landLoading}
                onClick={() => reivindicar(currentLote.coord_x, currentLote.coord_y, user)}
              >
                {landLoading ? 'SINCRO_DATA_LINK...' : 'REIVINDICAR_LOTE'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}