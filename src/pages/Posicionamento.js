// src/pages/Posicionamento.js
import React, { useState } from 'react';
import Tabuleiro from '../components/Tabuleiro';
import { useNavigate } from 'react-router-dom';

function Posicionamento() {
  const [tabuleiro, setTabuleiro] = useState(gerarTabuleiroVazio());
  const [direcao, setDirecao] = useState('horizontal');
  const [navioAtual, setNavioAtual] = useState(3); // começa com navio de 3 posições
  const [naviosPosicionados, setNaviosPosicionados] = useState(0);
  const navigate = useNavigate();

  function gerarTabuleiroVazio() {
    return Array(10).fill(null).map(() => Array(10).fill(''));
  }

  function podeColocarNavio(linha, coluna) {
    for (let i = 0; i < navioAtual; i++) {
      const l = direcao === 'vertical' ? linha + i : linha;
      const c = direcao === 'horizontal' ? coluna + i : coluna;
      if (l > 9 || c > 9 || tabuleiro[l][c] === '🚢') return false;
    }
    return true;
  }

  function colocarNavio(linha, coluna) {
    if (!podeColocarNavio(linha, coluna)) return;

    const novoTabuleiro = [...tabuleiro.map(row => [...row])];

    for (let i = 0; i < navioAtual; i++) {
      const l = direcao === 'vertical' ? linha + i : linha;
      const c = direcao === 'horizontal' ? coluna + i : coluna;
      novoTabuleiro[l][c] = '🚢';
    }

    setTabuleiro(novoTabuleiro);
    setNaviosPosicionados(prev => prev + 1);

    if (navioAtual === 3) {
      setNavioAtual(2);
    }
  }

  const iniciarPartida = async () => {
    const usuario = localStorage.getItem('usuario');
    const numero_jogador = localStorage.getItem('numero_jogador');

    // Extrair posições dos navios
    const navios = [];
    for (let i = 0; i < tabuleiro.length; i++) {
      for (let j = 0; j < tabuleiro[i].length; j++) {
        if (tabuleiro[i][j] === '🚢') {
          navios.push({ linha: i, coluna: j });
        }
      }
    }

    // Enviar para o servidor
    try {
      await fetch('http://localhost:5000/posicionar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, numero_jogador, navios }),
      });

      // Salvar localmente
      localStorage.setItem('tabuleiroProprio', JSON.stringify(tabuleiro));
      navigate('/jogar');
    } catch (error) {
      console.error('Erro ao enviar navios:', error);
      alert('Erro ao enviar navios. Tente novamente.');
    }
  };

  return (
    <div className="container-posicionar">
      <h2>Posicionamento de Navios</h2>
      <p>Você deve posicionar 2 navios: um com 3 posições e outro com 2 posições.</p>

      <div style={{ marginBottom: '10px' }}>
        <label>Direção:&nbsp;</label>
        <select value={direcao} onChange={(e) => setDirecao(e.target.value)}>
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
      </div>

      <Tabuleiro titulo="Clique para posicionar" tabuleiro={tabuleiro} onClick={colocarNavio} />

      {naviosPosicionados === 2 && (
        <button className="botao-confirmar" onClick={iniciarPartida}>
          ✅ Iniciar Partida
        </button>
      )}
    </div>
  );
}

export default Posicionamento;
