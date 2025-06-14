import React, { useState } from 'react';
import Tabuleiro from '../components/Tabuleiro';

function Jogar() {
  const [tabuleiroProprio, setTabuleiroProprio] = useState(carregarTabuleiroSalvo());
  const [tabuleiroInimigo, setTabuleiroInimigo] = useState(gerarTabuleiroVazio());
  const [vezDoJogador, setVezDoJogador] = useState(true);
  const [mensagem, setMensagem] = useState('Sua vez de jogar!');

  function gerarTabuleiroVazio() {
    return Array(10).fill(null).map(() => Array(10).fill(''));
  }

  function carregarTabuleiroSalvo() {
  const salvo = localStorage.getItem('tabuleiroProprio');
  if (salvo) return JSON.parse(salvo);
  return Array(10).fill(null).map(() => Array(10).fill(''));
}

  function handleCliqueCelula(linha, coluna) {
    if (!vezDoJogador || tabuleiroInimigo[linha][coluna] !== '') return;

    const novoTabuleiro = [...tabuleiroInimigo];
    const acertou = Math.random() > 0.5;
    novoTabuleiro[linha][coluna] = acertou ? '💥' : '❌';
    setTabuleiroInimigo(novoTabuleiro);
    setVezDoJogador(false);
    setMensagem('Aguardando adversário...');

    setTimeout(() => {
      setVezDoJogador(true);
      setMensagem('Sua vez de jogar!');
    }, 2000);
  }

  return (
    <div className="App">
      <h1>Batalha Naval</h1>
      <h2>{mensagem}</h2>

      <div className="tabuleiros">
        <Tabuleiro titulo="Seu Tabuleiro" tabuleiro={tabuleiroProprio} onClick={() => {}} />
        <Tabuleiro titulo="Tabuleiro Inimigo" tabuleiro={tabuleiroInimigo} onClick={handleCliqueCelula} />
      </div>

      <div className="legenda">
        <p>🌊 Água &nbsp;&nbsp; 🚢 Navio &nbsp;&nbsp; 💥 Acertou o navio &nbsp;&nbsp; ❌ Errou</p>
      </div>

      <button className="botao-reiniciar" onClick={() => window.location.reload()}>
        🔄 Reiniciar Jogo
      </button>
    </div>
  );
}

export default Jogar;
