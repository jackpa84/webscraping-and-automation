import React from 'react';
import { Box, Modal, Typography, IconButton, List, ListItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Task } from '../types';

interface TaskModalProps {
    open: boolean;
    onClose: () => void;
    task: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ open, onClose, task }) => {
    if (!task) return null;

    const {
        title,
        date,
        fullData: {
            authors,
            defendant,
            lawyers,
            gross_net_principal_amount,
            late_interest_amount,
            attorney_fees,
            content,
        },
    } = task;

    const formatCurrency = (amount?: number) => {
        return amount
            ? `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
            : 'N/A';
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('pt-BR');
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute' as const,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: '#fff',
                    borderRadius: 1,
                    boxShadow: 24,
                    width: 480,
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    p: 3,
                }}
            >
                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2D3A45' }}>
                        Publicação - {title}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Typography variant="body2" sx={{ mb: 1, color: '#2D3A45' }}>
                    <strong>Data de publicação no DJE:</strong> <br />
                    {formatDate(date)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, mb: 0.5, color: '#2D3A45' }}>
                    <strong>Autor:</strong>
                </Typography>
                <List dense sx={{ mb: 1 }}>
                    <ListItem sx={{ display: 'list-item', pl: 2 }}>
                        <Typography variant="body2" sx={{ color: '#2D3A45' }}>
                            {authors || 'N/A'}
                        </Typography>
                    </ListItem>
                </List>
                <Typography variant="body2" sx={{ mt: 2, mb: 0.5, color: '#2D3A45' }}>
                    <strong>Réu:</strong>
                </Typography>
                <List dense sx={{ mb: 1 }}>
                    <ListItem sx={{ display: 'list-item', pl: 2 }}>
                        <Typography variant="body2" sx={{ color: '#2D3A45' }}>
                            {defendant || 'N/A'}
                        </Typography>
                    </ListItem>
                </List>
                <Typography variant="body2" sx={{ mt: 2, mb: 0.5, color: '#2D3A45' }}>
                    <strong>Advogado(s):</strong>
                </Typography>
                <List dense sx={{ mb: 1 }}>
                    <ListItem sx={{ display: 'list-item', pl: 2 }}>
                        <Typography variant="body2" sx={{ color: '#2D3A45' }}>
                            {lawyers || 'N/A'}
                        </Typography>
                    </ListItem>
                </List>
                <Typography variant="body2" sx={{ mt: 2, color: '#2D3A45' }}>
                    <strong>Valor principal bruto/líquido:</strong> <br />
                    {formatCurrency(gross_net_principal_amount)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, color: '#2D3A45' }}>
                    <strong>Valor dos juros moratórios:</strong> <br />
                    {formatCurrency(late_interest_amount)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, color: '#2D3A45' }}>
                    <strong>Valor dos honorários advocatícios:</strong> <br />
                    {formatCurrency(attorney_fees)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, color: '#2D3A45' }}>
                    <strong>Conteúdo da Publicação:</strong> <br />
                    {content || 'N/A'}
                </Typography>
            </Box>
        </Modal>
    );
};

export default TaskModal;
