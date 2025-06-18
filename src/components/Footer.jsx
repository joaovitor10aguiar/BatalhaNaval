import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#00fb',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: 2,
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#A1B2C1',
        boxShadow: '0 -2px 5px rgba(0,0,0,0.7)',
        zIndex: 1000
      }}
    >
      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        &copy; {new Date().getFullYear()} Sistema Comercial |{' '}
        <Link
          href="https://www.una.br"
          target="_blank"
          rel="noopener"
          underline="hover"
          color="#00BFFF"
        >
          UNA Contagem
        </Link>
        <br />
        Desenvolvido por alunos para fins acadêmicos.
      </Typography>
    </Box>
  );
};

export default Footer;
