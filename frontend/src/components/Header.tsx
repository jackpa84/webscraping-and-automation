import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', color: '#072854', display: 'flex', alignItems: 'center' }}
        >
          JusCash
        </Typography>
        <Box>
          <IconButton
            onClick={onLogout}
            color="primary"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <ExitToAppIcon />
            <Typography variant="body1" sx={{ color: '#072854', fontWeight: 'bold' }}>
              Sair
            </Typography>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
