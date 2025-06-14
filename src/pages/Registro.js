// src/pages/Registro.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Registro() {
  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const navigate = useNavigate();

  const handleRegistro = async () => {
    try {
      const resposta = await axios.post("http://localhost:5000/registrar", {
        nome,
        usuario
      });

      if (resposta.data && resposta.data.numero_jogador) {
        localStorage.setItem("jogador", JSON.stringify(resposta.data));
        navigate('/posicionar');
      }
    } catch (error) {
      alert("Erro ao registrar jogador");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Registro de Jogador</h2>
      <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <input type="text" placeholder="Usuário" value={usuario} onChange={e => setUsuario(e.target.value)} />
      <button onClick={handleRegistro}>Registrar</button>
    </div>
  );
}

export default Registro;
