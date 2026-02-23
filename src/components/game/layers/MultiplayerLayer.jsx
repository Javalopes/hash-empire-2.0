import React from 'react';
import { Graphics, Container, Text } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext';
import * as PIXI from 'pixi.js';

export default function MultiplayerLayer({ players }) {
  const { user } = useAuth(); // Puxamos o teu ID de wallet

  return (
    <Container>
      {Object.entries(players)
        // FILTRO CRÍTICO: Só desenha se o ID for DIFERENTE da minha wallet
        .filter(([id]) => id !== user) 
        .map(([id, player]) => (
          <Container key={id} x={player.x} y={player.y}>
            {/* Boneco Rosa Néon para os Outros */}
            <Graphics
              draw={(g) => {
                g.clear();
                g.beginFill(0xff00ff, 0.3); // Glow externo
                g.drawCircle(0, 0, 15);
                g.endFill();
                g.beginFill(0xff00ff, 1);   // Centro sólido
                g.drawCircle(0, 0, 8);
                g.endFill();
              }}
            />
            {/* Nome/Wallet do Jogador por cima */}
            <Text
              text={id.substring(0, 4) + "..."}
              x={-15}
              y={-30}
              style={new PIXI.TextStyle({
                fill: 0xff00ff,
                fontSize: 10,
                fontFamily: 'monospace',
                fontWeight: 'bold'
              })}
            />
          </Container>
        ))}
    </Container>
  );
}
