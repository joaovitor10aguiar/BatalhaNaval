// src/pages/Registro.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Registro() {
  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const navigate = useNavigate();

  // Limpar dados antigos ao entrar na tela
  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleRegistro = async () => {
    if (!nome.trim() || !usuario.trim()) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const resposta = await axios.post("http://localhost:5000/registrar", {
        nome: nome.trim(),
        usuario: usuario.trim()
      });

      if (resposta.data && resposta.data.numero_jogador) {
        localStorage.setItem("jogador", JSON.stringify(resposta.data));
        localStorage.setItem("usuario", resposta.data.usuario);
        localStorage.setItem("numero_jogador", resposta.data.numero_jogador);
        navigate('/posicionar');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.mensagem) {
        alert("Erro: " + error.response.data.mensagem);
      } else {
        alert("Erro ao registrar jogador.");
      }
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Registro de Jogador</h2>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
      />
      <input
        type="text"
        placeholder="Usuário"
        value={usuario}
        onChange={e => setUsuario(e.target.value)}
      />
      <button onClick={handleRegistro}>Registrar</button>
    </div>
  );
}

export default Registro;
