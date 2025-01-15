import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';

interface KanbanCardProps {
  id: string;
  title: string;
  date: string;
  updatedAt: string;
  onClick: () => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ id, title, date, updatedAt, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const now = Date.now();
  const lastUpdate = new Date(updatedAt).getTime();
  const diffInHours = Math.floor((now - lastUpdate) / (1000 * 60 * 60));

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '8px',
    cursor: isDragging ? 'grabbing' : 'pointer',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e0e0e0',
    width: '100%',
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      {...attributes}
      {...listeners}
    >
      <CardContent style={{ padding: '16px' }}>
        <Typography
          variant="body1"
          style={{
            fontWeight: 500,
            fontSize: '16px',
            marginBottom: '12px',
            color: '#2D3A45',
          }}
        >
          {title}
        </Typography>

        <Box display="flex" alignItems="center" gap="16px">
          <Box display="flex" alignItems="center" gap="4px">
            <AccessTimeIcon fontSize="small" sx={{ color: '#607D8B' }} />
            <Typography variant="body2" style={{ color: '#607D8B' }}>
              {`Há ${diffInHours}h`}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap="4px">
            <EventIcon fontSize="small" sx={{ color: '#607D8B' }} />
            <Typography variant="body2" style={{ color: '#607D8B' }}>
              {new Date(date).toLocaleDateString('pt-BR')}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KanbanCard;
