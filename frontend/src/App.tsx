import React, { useState, useEffect } from 'react';
import { Container, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import KanbanBoard from "./pages/KanbanBoard";
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4caf50' },
    background: { default: '#ffffff' },
  },
  typography: { fontFamily: 'Roboto, sans-serif' },
});

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const handleLoginSuccess = (token: string) => {
    setToken(token);
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        {token ? (
          <>
            <Header onLogout={handleLogout} />
            <KanbanBoard onLogout={handleLogout} />
          </>
        ) : showLogin ? (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onShowRegister={() => setShowLogin(false)}
          />
        ) : (
          <Register
            onLoginSuccess={handleLoginSuccess}
            onShowLogin={() => setShowLogin(true)}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
