import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const iniciarPartida = () => {
    // Aqui futuramente chamaremos o backend para criar uma nova partida
    navigate('/registro');
  };

  return (
    <div>
      <h1>Batalha Naval</h1>
      <p>Bem-vindo ao jogo!</p>
      <button onClick={iniciarPartida}>🚀 Vamos Começar</button>
      <p>Desafie outro jogador e conquiste os mares!</p>
    </div>
  );
}

export default Home;
