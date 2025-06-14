import React, { useEffect } from 'react';

function AguardandoConexao() {
  useEffect(() => {
    const intervalo = setInterval(() => {
      // Aqui futuramente você verificará com WebSocket ou fetch se o jogo pode começar

      // Exemplo fictício:
      // if (prontoParaComecar) window.location.href = '/jogar';
    }, 3000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="App">
      <h2>O jogo vai começar em breve...</h2>
      <p>Aguardando o outro jogador se conectar.</p>
    </div>
  );
}

export default AguardandoConexao;
