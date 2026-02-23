import React from 'react';
import { Graphics, Container, Text } from '@pixi/react';
import { useAuth } from '../../../lib/AuthContext.jsx';
import * as PIXI from 'pixi.js';

export default function MultiplayerLayer({ players = {} }) {
  const { user } = useAuth();
  
  // Converte a tua wallet para string para comparação segura
  const myId = user ? (typeof user === 'string' ? user : user.toString()) : null;

  return (
    <Container>
      {Object.entries(players)
        .filter(([id]) => {
          // DEBUG: Se continuares a ver o clone, vê este log no F12
          // console.log(`Comparando local: ${myId} com remoto: ${id}`);
          return id !== myId; 
        })
        .map(([id, player]) => (
          <Container key={id} x={player.x} y={player.y}>
            <Graphics
              draw={(g) => {
                g.clear();
                g.beginFill(0xff00ff, 0.3);
                g.drawCircle(0, 0, 15);
                g.endFill();
                g.beginFill(0xff00ff, 1);
                g.drawCircle(0, 0, 8);
                g.endFill();
              }}
            />
            <Text
              text={id.substring(0, 6)}
              x={-20} y={-35}
              style={new PIXI.TextStyle({ fill: 0xff00ff, fontSize: 10, fontFamily: 'monospace' })}
            />
          </Container>
        ))}
    </Container>
  );
}
