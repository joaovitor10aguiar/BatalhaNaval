import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Tabuleiro from '../components/Tabuleiro';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Jogar() {
  const socket = useRef(null);
  const [tabuleiroProprio, setTabuleiroProprio] = useState(gerarTabuleiroVazio());
  const [tabuleiroInimigo, setTabuleiroInimigo] = useState(gerarTabuleiroVazio());
  const [vezDoJogador, setVezDoJogador] = useState(false);
  const [mensagem, setMensagem] = useState('Aguardando adversário...');
  const navigate = useNavigate();

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

      fetch(`http://localhost:5000/estado/${numeroJogador}`)
        .then(res => res.json())
        .then(data => {
          const novoProprio = gerarTabuleiroVazio();
          const novoInimigo = gerarTabuleiroVazio();

          data.navios.forEach(([l, c]) => {
            novoProprio[l][c] = '🚢';
          });

          data.ataques_recebidos.forEach(([l, c]) => {
            const acertou = data.navios.some(([ln, cn]) => ln === l && cn === c);
            novoProprio[l][c] = acertou ? '💥' : '❌';
          });

          data.ataques_feitos.forEach(([l, c]) => {
            novoInimigo[l][c] = '❌';
          });

          setTabuleiroProprio(novoProprio);
          setTabuleiroInimigo(novoInimigo);
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

    socket.current.on('solicitacao_reinicio', ({ de }) => {
      Swal.fire({
        title: `Jogador ${de} deseja reiniciar a partida`,
        showCancelButton: true,
        confirmButtonText: 'Aceitar',
        cancelButtonText: 'Recusar'
      }).then((result) => {
        if (result.isConfirmed) {
          socket.current.emit('confirmar_reinicio', { numero_jogador: numeroJogador });
        }
      });
    });

    socket.current.on('reiniciar_posicionamento', () => {
      localStorage.removeItem('tabuleiroProprio');
      navigate('/posicionar');
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  function gerarTabuleiroVazio() {
    return Array(10).fill(null).map(() => Array(10).fill(''));
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

  function solicitarReinicio() {
    fetch('http://localhost:5000/solicitar_reinicio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numero_jogador: numeroJogador })
    }).then(() => {
      Swal.fire('Solicitação enviada', 'Aguardando confirmação do adversário...', 'info');
    });
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
      <div className="botoes-controle">
        <button className="botao-reiniciar" onClick={solicitarReinicio}>
          🔁 Solicitar Reinício
        </button>
      </div>
    </div>
  );
}

export default Jogar;
