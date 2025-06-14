import React from 'react';
import Celula from './Celula';
import './Tabuleiro.css';

function Tabuleiro({ titulo, tabuleiro, onClick }) {
  return (
    <div className="tabuleiro">
      <h3>{titulo}</h3>
      <div className="grade">
        {tabuleiro.map((linha, i) =>
          linha.map((celula, j) => (
            <Celula key={`${i}-${j}`} valor={celula} onClick={() => onClick(i, j)} />
          ))
        )}
      </div>
    </div>
  );
}

export default Tabuleiro;
