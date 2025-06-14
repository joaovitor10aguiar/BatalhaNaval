import React, { useEffect } from 'react';

function AguardandoPosicionamento() {
  useEffect(() => {
    // Aqui futuramente você vai checar via backend (polling ou WebSocket)
    const intervalo = setInterval(() => {
      // Exemplo de verificação fictícia:
      // fetch('/verificar-segundo-jogador').then(...)

      // Suponha que ele detectou que o oponente posicionou
      // window.location.href = '/aguardando-conexao';
    }, 3000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="App">
      <h2>Aguardando o outro jogador posicionar os navios...</h2>
      <p>Assim que ambos terminarem, o jogo irá começar automaticamente.</p>
    </div>
  );
}

export default AguardandoPosicionamento;
