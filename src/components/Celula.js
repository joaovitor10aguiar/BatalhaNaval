import React from 'react';
import './Celula.css';

function Celula({ valor, onClick }) {
  return (
    <div className="celula" onClick={onClick}>
      {valor}
    </div>
  );
}

export default Celula;
