// src/pages/PosicionarNavios.jsx
import React, { useState } from 'react';
import './PosicionarNavios.css';
import { useNavigate } from 'react-router-dom';

const LINHAS = 10;
const COLUNAS = 10;

function PosicionarNavios() {
  const navigate = useNavigate();
  const [navios, setNavios] = useState([]);
  const [mensagem, setMensagem] = useState('Posicione 1 navio de 3 células e 1 navio de 2 células.');

  const usuario = localStorage.getItem('usuario');
  const numero_jogador = Number(localStorage.getItem('numero_jogador')); // Correção aqui

  const toggleCelula = (linha, coluna) => {
    const key = `${linha},${coluna}`;
    const jaSelecionada = navios.some(pos => `${pos.linha},${pos.coluna}` === key);

    if (jaSelecionada) {
      setNavios(navios.filter(pos => `${pos.linha},${pos.coluna}` !== key));
    } else {
      if (navios.length >= 5) {
        setMensagem('Você já selecionou 5 células. Remova uma para escolher outra.');
        return;
      }
      setNavios([...navios, { linha, coluna }]);
    }
  };

  const gerarTabuleiroComNavios = () => {
    const tabuleiro = Array(10).fill(null).map(() => Array(10).fill(''));
    navios.forEach(({ linha, coluna }) => {
      tabuleiro[linha][coluna] = '🚢';
    });
    return tabuleiro;
  };

  const enviarPosicoes = async () => {
    if (navios.length !== 5) {
      setMensagem('Você precisa selecionar exatamente 5 posições.');
      return;
    }

    try {
      await fetch('http://localhost:5000/posicionar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, numero_jogador, navios }),
      });

      // Salva visual local do tabuleiro
      const tabuleiroProprio = gerarTabuleiroComNavios();
      localStorage.setItem('tabuleiroProprio', JSON.stringify(tabuleiroProprio));

      navigate('/aguardando-oponente');
    } catch (error) {
      console.error(error);
      setMensagem('Erro ao enviar navios. Tente novamente.');
    }
  };

  const renderTabuleiro = () => {
    const linhas = [];
    for (let i = 0; i < LINHAS; i++) {
      const colunas = [];
      for (let j = 0; j < COLUNAS; j++) {
        const selecionada = navios.some(pos => pos.linha === i && pos.coluna === j);
        colunas.push(
          <td
            key={`${i}-${j}`}
            className={selecionada ? 'celula selecionada' : 'celula'}
            onClick={() => toggleCelula(i, j)}
          />
        );
      }
      linhas.push(<tr key={i}>{colunas}</tr>);
    }
    return <table className="tabuleiro">{linhas}</table>;
  };

  return (
    <div className="posicionar-container">
      <h2>Posicione seus navios</h2>
      <p>{mensagem}</p>
      {renderTabuleiro()}
      <button className="botao-confirmar" onClick={enviarPosicoes}>Confirmar posições</button>
    </div>
  );
}

export default PosicionarNavios;
