import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, TextField, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface KanbanHeaderProps {
    onSearch: (searchTerm: string, fromDate: string, toDate: string) => void;
}

const KanbanHeader: React.FC<KanbanHeaderProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const handleSearch = () => {
        onSearch(searchTerm, fromDate, toDate);
    };

    return (
        <AppBar position="static" color="transparent" elevation={1}>
            <Toolbar
                sx={{
                    justifyContent: 'space-between',
                    p: { xs: '10px 12px', sm: '15px 16px' },
                    flexDirection: { xs: 'column', sm: 'row' }, // para alinhar verticalmente no mobile
                    gap: { xs: 2, sm: 0 },
                }}
            >
                <Typography variant="h4" sx={{ color: '#072854', alignSelf: { xs: 'center', sm: 'auto' } }}>
                    Publicações
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flexWrap: 'wrap',
                        width: { xs: '100%', sm: 'auto' },
                        justifyContent: { xs: 'center', sm: 'flex-end' },
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 0.5, color: '#072854', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: 'inherit' } }}
                        >
                            Pesquisar
                        </Typography>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Digite o número do processo ou nome"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '4px',
                                width: { xs: '250px', sm: '300px' },
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 0.5, color: '#072854', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: 'inherit' } }}
                        >
                            De
                        </Typography>
                        <TextField
                            type="date"
                            variant="outlined"
                            size="small"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '4px',
                                width: { xs: '120px', sm: '150px' },
                            }}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 0.5, color: '#072854', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: 'inherit' } }}
                        >
                            Até
                        </Typography>
                        <TextField
                            type="date"
                            variant="outlined"
                            size="small"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '4px',
                                width: { xs: '120px', sm: '150px' },
                            }}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>

                    <IconButton
                        color="primary"
                        onClick={handleSearch}
                        sx={{
                            backgroundColor: '#4CAF50',
                            borderRadius: '4px',
                            height: '40px',
                            width: '40px',
                            mt: { xs: 1, sm: 0 },
                            '&:hover': {
                                backgroundColor: '#43A047',
                            },
                        }}
                    >
                        <SearchIcon sx={{ color: '#fff' }} />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default KanbanHeader;
