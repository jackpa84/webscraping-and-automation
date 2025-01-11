import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Paper, Typography } from '@mui/material';
import KanbanCard from './KanbanCard';
import { Task } from '../types'; // ou defina Task inline

interface KanbanColumnProps {
    id: string;
    title: string;
    tasks: Task[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, tasks }) => {
    const { setNodeRef } = useDroppable({ id });
    return (
        <Paper
            ref={setNodeRef}
            style={{
                padding: '16px',
                width: '300px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                minHeight: '400px',
            }}
            elevation={3}
        >
            <Typography variant="h6" align="center" gutterBottom color="primary">
                {title}
            </Typography>
            {tasks.map((task) => (
                <KanbanCard key={task.id} id={task.id} title={task.title} />
            ))}
        </Paper>
    );
};

export default KanbanColumn;
