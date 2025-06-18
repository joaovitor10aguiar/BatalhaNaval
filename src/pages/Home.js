import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button } from '@mui/material';
import Logo from './Logo_batalha.png';

const Home = () => {
  const navigate = useNavigate();

  const iniciarPartida = () => {
    navigate('/registro');
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: 10,
        textAlign: 'center',
        color: '#0D1B2A',
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {/* Logo centralizada */}
      <Box
        sx={{
            position: 'relative',
            width: '200%',
            maxWidth: 'none',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 4,
          }}
      >
        <img
          src={Logo}
          alt="Logo desenhada por Raissa"
          style={{ width: '100%', height: 'auto' }}
        />
      </Box>

      {/* Texto simples */}
      <Typography variant="body1" sx={{ marginBottom: 4 }}>
        Desafie um jogador e conquiste os mares! Este é um jogo desenvolvido como trabalho final da disciplina de Sistemas Distribuídos e Mobile.
      </Typography>

      {/* Botão */}
      <Button
        variant="contained"
        color="primary"
        size="medium"
        onClick={iniciarPartida}
      >
        🚀 Começar
      </Button>
    </Container>
  );
};

export default Home;
