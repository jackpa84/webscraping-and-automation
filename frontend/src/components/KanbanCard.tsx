import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, Typography } from '@mui/material';

interface KanbanCardProps {
    id: string;
    title: string;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ id, title }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        marginBottom: '8px',
        cursor: 'grab',
        backgroundColor: '#ffffff',
        border: '1px solid #4caf50',
        borderRadius: '4px',
        padding: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    };

    return (
        <Card ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <CardContent style={{ padding: '8px' }}>
                <Typography variant="body1" color="textPrimary">
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default KanbanCard;
