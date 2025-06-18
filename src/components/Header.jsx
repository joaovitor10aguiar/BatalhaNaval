import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#00bff', 
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.7)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
            letterSpacing: '1px',
          }}
        >
          °.~ 🚢🌊... Batalha Naval ...🚢🌊 ~.° - Trabalho Final
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
