import React from 'react';
import {Box, Paper, Typography} from '@mui/material';
import {useDroppable} from '@dnd-kit/core';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
    id: string;
    title: string;
    tasks: {
        id: string;
        title: string;
        date: string;
        updatedAt: string;
    }[];
    onCardClick: (
        task: {
            id: string;
            title: string;
            date: string;
            updatedAt: string;
        }
    ) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({id, title, tasks, onCardClick}) => {
    const {setNodeRef} = useDroppable({id});

    return (
        <Paper
            ref={setNodeRef}
            sx={{
                p: 0,
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                height: '77vh',
                width: '100%',
                boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                '@media (max-width:600px)': {
                    height: 'calc(100vh - 140px)',
                },
            }}
        >
            <Box
                sx={{
                    p: '8px 16px',
                    backgroundColor: '#f5f5f5',
                    borderBottom: '1px solid #072854',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: '#072854',
                        fontWeight: 'bold',
                        fontSize: '16px',
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: '#072854',
                        fontWeight: 'bold',
                        fontSize: '14px',
                    }}
                >
                    {tasks.length}
                </Typography>
            </Box>
            <Box
                sx={{
                    p: '16px',
                    overflowY: 'auto',
                    flexGrow: 1,
                }}
            >
                {tasks.map((task) => (
                    <KanbanCard
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        date={task.date}
                        updatedAt={task.updatedAt}
                        onClick={() => onCardClick(task)}
                    />
                ))}
            </Box>
        </Paper>
    );
};

export default KanbanColumn;
