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
            <Toolbar style={{ justifyContent: 'space-between', padding: '15px 16px' }}>
                <Typography variant="h4" style={{ color: '#072854' }}>
                    Publicações
                </Typography>
                <Box display="flex" alignItems="center" gap="16px" flexWrap="wrap">
                    <Box display="flex" flexDirection="column">
                        <Typography variant="body2" style={{ marginBottom: '4px', color: '#072854', fontWeight: 'bold' }}>
                            Pesquisar
                        </Typography>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Digite o número do processo ou nome"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ backgroundColor: '#fff', borderRadius: '4px', width: '300px' }}
                        />
                    </Box>
                    <Box display="flex" flexDirection="column">
                        <Typography variant="body2" style={{ marginBottom: '4px', color: '#072854', fontWeight: 'bold' }}>
                            De
                        </Typography>
                        <TextField
                            type="date"
                            variant="outlined"
                            size="small"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            style={{ backgroundColor: '#fff', borderRadius: '4px', width: '150px' }}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                    <Box display="flex" flexDirection="column">
                        <Typography variant="body2" style={{ marginBottom: '4px', color: '#072854', fontWeight: 'bold' }}>
                            Até
                        </Typography>
                        <TextField
                            type="date"
                            variant="outlined"
                            size="small"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            style={{ backgroundColor: '#fff', borderRadius: '4px', width: '150px' }}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                    <Box display="flex" alignItems="center">
                        <IconButton
                            color="primary"
                            onClick={handleSearch}
                            style={{
                                backgroundColor: '#4CAF50',
                                borderRadius: '4px',
                                height: '40px',
                                width: '40px',
                                marginTop: '16px',
                            }}
                        >
                            <SearchIcon style={{ color: '#fff' }} />
                        </IconButton>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default KanbanHeader;
