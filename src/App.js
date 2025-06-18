// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Registro from './pages/Registro';
import Posicionamento from './pages/Posicionamento';
import Header from './components/Header';
import Footer from './components/Footer';
import AguardandoOponente from './pages/AguardandoOponente';
import Jogar from './pages/Jogar';
import AguardandoPosicionamento from './pages/AguardandoPosicionamento';
import AguardandoConexao from './pages/AguardandoConexao';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header /> {/* Fica fixo no topo */}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/posicionar" element={<Posicionamento />} />
          <Route path="/aguardando-posicionamento" element={<AguardandoPosicionamento />} />
          <Route path="/aguardando-conexao" element={<AguardandoConexao />} />
          <Route path="/jogar" element={<Jogar />} />
          <Route path="/aguardando-oponente" element={<AguardandoOponente />} />
        </Routes>

        <Footer /> {/* Fica fixo no rodapé */}
      </div>
    </Router>
  );
}

export default App;
