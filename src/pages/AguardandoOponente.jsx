import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function AguardandoOponente() {
  const navigate = useNavigate();
  const numero_jogador = localStorage.getItem('numero_jogador');

  useEffect(() => {
    socket.emit('pronto', { numero_jogador });

    socket.on('iniciar_partida', () => {
      navigate('/jogar');
    });

    return () => {
      socket.off('iniciar_partida');
    };
  }, [navigate, numero_jogador]);

  return (
    <div style={{ textAlign: 'center', marginTop: '60px' }}>
      <h1>Aguardando oponente...</h1>
      <p>Assim que o outro jogador terminar de posicionar os navios, a partida começará automaticamente.</p>
    </div>
  );
}

export default AguardandoOponente;
