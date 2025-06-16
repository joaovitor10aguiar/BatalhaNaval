// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Registro from './pages/Registro';
import Posicionamento from './pages/Posicionamento';
import AguardandoOponente from './pages/AguardandoOponente';
import Jogar from './pages/Jogar';
import AguardandoPosicionamento from './pages/AguardandoPosicionamento';
import AguardandoConexao from './pages/AguardandoConexao';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/posicionar" element={<Posicionamento />} />
          <Route path="/aguardando-posicionamento" element={<AguardandoPosicionamento />} />
          <Route path="/aguardando-conexao" element={<AguardandoConexao />} />  
          <Route path="/jogar" element={<Jogar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
