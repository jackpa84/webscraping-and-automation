// src/App.tsx
import React from 'react';
import { CssBaseline, Container, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import KanbanBoard from './components/KanbanBoard';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#4caf50', // verde elegante
        },
        background: {
            default: '#ffffff',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Meu Quadro Kanban
                </Typography>
                <KanbanBoard />
            </Container>
        </ThemeProvider>
    );
};

export default App;
