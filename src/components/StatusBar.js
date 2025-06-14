import React from 'react';

function StatusBar({ mensagem }) {
  return (
    <div className="status-bar">
      <h2>{mensagem}</h2>
    </div>
  );
}

export default StatusBar;
