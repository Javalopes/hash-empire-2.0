import React from 'react';
import { Graphics, Container, Text } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';
import * as PIXI from 'pixi.js';

export default function MultiplayerLayer({ players = {} }) {
  const { user } = useAuth(); // O teu ID (Ex: 9kPNck...)

  // Log de Debug para vermos quem está na rede (vê na consola F12)
  // console.log("👥 [MULTIPLAYER] Lista de IDs recebidos:", Object.keys(players));

  return (
    <Container>
      {Object.entries(players)
        // 🛡️ FILTRO DE SEGURANÇA: Remove o meu próprio ID da lista de desenho
        .filter(([id]) => id !== user) 
        .map(([id, player]) => (
          <Container key={id} x={player.x} y={player.y}>
            {/* Boneco Magenta para os Vizinhos */}
            <Graphics
              draw={(g) => {
                g.clear();
                g.beginFill(0xff00ff, 0.3); // Glow néon
                g.drawCircle(0, 0, 15);
                g.endFill();
                g.beginFill(0xff00ff, 1);   // Núcleo sólido
                g.drawCircle(0, 0, 8);
                g.endFill();
              }}
            />
            {/* Etiqueta de Identificação */}
            <Text
              text={id ? id.substring(0, 5) : "???"}
              x={-20}
              y={-35}
              style={new PIXI.TextStyle({
                fill: 0xff00ff,
                fontSize: 11,
                fontFamily: 'monospace',
                fontWeight: 'bold',
                dropShadow: true,
                dropShadowColor: '#000000',
                dropShadowBlur: 4,
                dropShadowDistance: 2
              })}
            />
          </Container>
        ))}
    </Container>
  );
}
