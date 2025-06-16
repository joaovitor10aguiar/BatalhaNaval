import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Tabuleiro from '../components/Tabuleiro';

function Jogar() {
  const socket = useRef(null);
  const [tabuleiroProprio, setTabuleiroProprio] = useState(carregarTabuleiroSalvo());
  const [tabuleiroInimigo, setTabuleiroInimigo] = useState(gerarTabuleiroVazio());
  const [vezDoJogador, setVezDoJogador] = useState(false);
  const [mensagem, setMensagem] = useState('Aguardando adversário...');

  const numeroJogador = Number(localStorage.getItem('numero_jogador')) || 1;
  const usuario = localStorage.getItem('usuario') || 'anonimo';

  useEffect(() => {
    socket.current = io('http://localhost:5000');

    socket.current.on('connect', () => {
      console.log('Conectado ao servidor');
    });

    if (usuario && numeroJogador) {
      socket.current.emit('pronto', {
        numero_jogador: numeroJogador,
        usuario: usuario,
      });
    }

    socket.current.on('sua_vez', () => {
      setVezDoJogador(true);
      setMensagem('Sua vez de jogar!');
    });

    socket.current.on('aguarde', () => {
      setVezDoJogador(false);
      setMensagem('Aguardando adversário...');
    });

    socket.current.on('resultado_jogada', (data) => {
      const { linha, coluna, acerto, jogador } = data;
      atualizarTabuleiroRecebido(linha, coluna, acerto, jogador);
    });

    socket.current.on('fim_de_jogo', ({ vencedor }) => {
      if (vencedor === numeroJogador) {
        alert('Parabéns! Você venceu a partida!');
      } else {
        alert('Você perdeu! O adversário venceu.');
      }
      setMensagem('Fim de jogo');
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  function gerarTabuleiroVazio() {
    return Array(10).fill(null).map(() => Array(10).fill(''));
  }

  function carregarTabuleiroSalvo() {
    const salvo = localStorage.getItem('tabuleiroProprio');
    if (salvo) return JSON.parse(salvo);
    return gerarTabuleiroVazio();
  }

  function handleCliqueCelula(linha, coluna) {
    if (!vezDoJogador || tabuleiroInimigo[linha][coluna] !== '') return;

    socket.current.emit('jogada', {
      usuario: usuario,
      numero_jogador: numeroJogador,
      linha,
      coluna
    });

    setVezDoJogador(false);
    setMensagem('Aguardando adversário...');
  }

  function atualizarTabuleiroRecebido(linha, coluna, acerto, jogadorJogando) {
    if (jogadorJogando === numeroJogador) {
      setTabuleiroInimigo(prev => {
        const novo = prev.map(row => [...row]);
        novo[linha][coluna] = acerto ? '💥' : '❌';
        return novo;
      });
    } else {
      setTabuleiroProprio(prev => {
        const novo = prev.map(row => [...row]);
        novo[linha][coluna] = acerto ? '💥' : '❌';
        return novo;
      });
    }
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