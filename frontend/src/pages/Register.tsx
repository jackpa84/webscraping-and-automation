import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

interface RegisterProps {
  onLoginSuccess: (token: string) => void;
  onShowLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onLoginSuccess, onShowLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const validatePassword = (pwd: string) => {
    return passwordRegex.test(pwd);
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleRegister = async () => {
  setError('');
  setPasswordError('');
  setConfirmPasswordError('');

  if (!validatePassword(password)) {
    setPasswordError(
      'A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial.'
    );
    return;
  }
  if (password !== confirmPassword) {
    setConfirmPasswordError('As senhas não conferem.');
    return;
  }
  try {
    setIsLoading(true);
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      fullname: fullName,
      email,
      password,
    });
    const { token } = response.data;
    onLoginSuccess(token);
  } catch (err: any) {
    setError(err?.response?.data?.message || 'Falha ao criar conta.');
  } finally {
    setIsLoading(false);
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
          py: 4,
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
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: '#072854',
            mb: 3,
            textAlign: 'center',
          }}
        >
          Criar Conta
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && (
            <Typography variant="body2" color="error" textAlign="center">
              {error}
            </Typography>
          )}
          <Typography variant="body1" sx={{ textAlign: 'left', fontWeight: 'bold' }}>
            Seu nome completo: <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            placeholder="Ex: João da Silva"
            variant="outlined"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Typography variant="body1" sx={{ textAlign: 'left', fontWeight: 'bold' }}>
            E-mail: <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            placeholder="Digite seu e-mail"
            variant="outlined"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Typography variant="body1" sx={{ textAlign: 'left', fontWeight: 'bold' }}>
            Senha: <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            placeholder="Digite sua senha"
            variant="outlined"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError('');
            }}
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body1" sx={{ textAlign: 'left', fontWeight: 'bold' }}>
            Confirme sua senha: <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            placeholder="Repita a senha"
            variant="outlined"
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (confirmPasswordError) setConfirmPasswordError('');
            }}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowConfirmPassword} onMouseDown={handleMouseDownPassword} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleRegister}
              sx={{
                backgroundColor: '#4caf50',
                color: '#fff',
                fontWeight: 'bold',
                width: '160px',
                alignSelf: 'center',
                '&:hover': { backgroundColor: '#43a047' },
              }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Criar conta'}
            </Button>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Já possui uma conta?{' '}
          <Link
            sx={{ textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={onShowLogin}
          >
            Fazer o login
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Register;
