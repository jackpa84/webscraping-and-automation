import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
  onShowRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onShowRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      const { token } = response.data;
      onLoginSuccess(token);
    } catch (err) {
      setError('Login falhou. Verifique suas credenciais.');
      console.error('Erro no login:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: '#072854',
            mb: 3,
            textAlign: 'center',
          }}
        >
          JusCash
        </Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {error && (
            <Typography variant="body2" color="error" textAlign="center">
              {error}
            </Typography>
          )}
          <Typography variant="body1" sx={{ textAlign: 'left', fontWeight: 'bold' }}>
            E-mail:
          </Typography>
          <TextField
            placeholder="Digite seu e-mail"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Typography variant="body1" sx={{ textAlign: 'left', fontWeight: 'bold' }}>
            Senha:
          </Typography>
          <TextField
            placeholder="Digite sua senha"
            variant="outlined"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{
              backgroundColor: '#4caf50',
              color: '#fff',
              fontWeight: 'bold',
              width: '120px',
              alignSelf: 'center',
              '&:hover': {
                backgroundColor: '#43a047',
              },
            }}
          >
            Login
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Não possui uma conta?{' '}
          <Link
            sx={{ textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={onShowRegister}
          >
            Cadastre-se
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Login;
