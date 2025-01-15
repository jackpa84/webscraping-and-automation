import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
  Box,
  Modal,
  Typography,
  Snackbar,
  IconButton,
  List,
  ListItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KanbanColumn from '../components/KanbanColumn';
import KanbanHeader from '../components/KanbanHeader';
import { Column, Task } from '../types';

interface Process {
  _id: { $oid: string } | string;
  process_number: string;
  authors: string;
  lawyers: string;
  gross_net_principal_amount: number;
  late_interest_amount: number;
  attorney_fees: number;
  status: string;
  defendant: string;
  content: string;
  availability_date: { $date: string } | string;
  created_at: { $date: string } | string;
  updated_at: { $date: string } | string;
}

const COLUMN_DEFINITIONS: { [key: string]: { id: string; title: string } } = {
  new: { id: 'new', title: 'Publicações Novas' },
  read: { id: 'read', title: 'Publicações Lidas' },
  lawyer: { id: 'lawyer', title: 'Publicações Enviadas para ADV' },
  completed: { id: 'completed', title: 'Concluídas' },
};

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [filteredColumns, setFilteredColumns] = useState<Column[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/auth/list-cards`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const processes: Process[] = response.data;
        const columnsData: { [key: string]: Column } = {};
        Object.keys(COLUMN_DEFINITIONS).forEach((key) => {
          columnsData[key] = {
            id: COLUMN_DEFINITIONS[key].id,
            title: COLUMN_DEFINITIONS[key].title,
            tasks: [],
          };
        });
        processes.forEach((process) => {
          const processId =
              typeof process._id === 'object' ? process._id.$oid : process._id;
          const availabilityDate =
              typeof process.availability_date === 'object'
                  ? process.availability_date.$date
                  : process.availability_date;
          const createdAt =
              typeof process.created_at === 'object'
                  ? process.created_at.$date
                  : process.created_at;
          const updatedAt =
              typeof process.updated_at === 'object'
                  ? process.updated_at.$date
                  : process.updated_at;
          if (process.status && columnsData[process.status]) {
            columnsData[process.status].tasks.push({
              id: processId,
              title: process.process_number,
              date: availabilityDate,
              updatedAt,
              createdAt,
              columnId: process.status,
              fullData: {
                _id: processId,
                authors: process.authors,
                lawyers: process.lawyers,
                gross_net_principal_amount: process.gross_net_principal_amount,
                late_interest_amount: process.late_interest_amount,
                attorney_fees: process.attorney_fees,
                status: process.status,
                defendant: process.defendant,
                content: process.content,
                availability_date: availabilityDate,
                created_at: createdAt,
                updated_at: updatedAt,
              },
            });
          }
        });
        const mappedColumns = Object.values(columnsData);
        setColumns(mappedColumns);
        setFilteredColumns(mappedColumns);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          window.location.href = '/login';
          return;
        }
        console.error('Erro ao buscar processos:', error);
      }
    };
    fetchProcesses();
  }, []);

  const handleSearch = (searchTerm: string, fromDate: string, toDate: string) => {
    const filtered = columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        const taskDate = new Date(task.date);
        const matchesFromDate = !fromDate || taskDate >= new Date(fromDate);
        const matchesToDate = !toDate || taskDate <= new Date(toDate);
        return matchesSearch && matchesFromDate && matchesToDate;
      }),
    }));
    setFilteredColumns(filtered);
  };

  const handleCardClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id;
    const task = columns.flatMap((column) => column.tasks).find((t) => t.id === activeId);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) {
      setActiveTask(null);
      return;
    }
    const fromColumnId = columns.find((column) =>
        column.tasks.some((task) => task.id === activeId)
    )?.id;
    if (!fromColumnId) {
      setActiveTask(null);
      return;
    }
    let toColumnId = columns.find((c) => c.id === overId)?.id;
    if (!toColumnId) {
      const cardOverColumn = columns.find((c) =>
          c.tasks.some((task) => task.id === overId)
      );
      toColumnId = cardOverColumn?.id;
    }
    if (!toColumnId) {
      setActiveTask(null);
      return;
    }
    let isValidMovement = false;
    if (fromColumnId === 'new' && toColumnId === 'read') {
      isValidMovement = true;
    } else if (fromColumnId === 'read' && toColumnId === 'lawyer') {
      isValidMovement = true;
    } else if (
        fromColumnId === 'lawyer' &&
        (toColumnId === 'completed' || toColumnId === 'read')
    ) {
      isValidMovement = true;
    }
    if (!isValidMovement) {
      setSnackbarMessage(`Movimento inválido de ${fromColumnId} para ${toColumnId}`);
      setSnackbarOpen(true);
      setActiveTask(null);
      return;
    }
    try {
      await axios.put(`${API_BASE_URL}/auth/processes/${activeId}`, { status: toColumnId });
    } catch (error: any) {
      if (error.response && error.response.data === 'berar token') {
        window.location.href = '/login';
        return;
      }
      console.error('Erro ao atualizar processo no backend:', error);
      setSnackbarMessage('Erro ao atualizar processo no backend.');
      setSnackbarOpen(true);
    }
    setColumns((prev) => {
      return prev.map((col) => {
        if (col.id === fromColumnId) {
          return {
            ...col,
            tasks: col.tasks.filter((t) => t.id !== activeId),
          };
        }
        if (col.id === toColumnId) {
          const movedTask = prev
              .find((c) => c.id === fromColumnId)
              ?.tasks.find((t) => t.id === activeId);
          if (movedTask) {
            return { ...col, tasks: [...col.tasks, { ...movedTask, columnId: toColumnId }] };
          }
        }
        return col;
      });
    });
    setFilteredColumns((prev) => {
      return prev.map((col) => {
        if (col.id === fromColumnId) {
          return {
            ...col,
            tasks: col.tasks.filter((t) => t.id !== activeId),
          };
        }
        if (col.id === toColumnId) {
          const fromCol = prev.find((c) => c.id === fromColumnId);
          const movedTask = fromCol?.tasks.find((t) => t.id === activeId);
          if (movedTask) {
            return { ...col, tasks: [...col.tasks, { ...movedTask, columnId: toColumnId }] };
          }
        }
        return col;
      });
    });
    setActiveTask(null);
  };

  return (
      <>
        <KanbanHeader onSearch={handleSearch} />
        <Box
            sx={{
              mt: 2,
              display: 'flex',
              flexDirection: 'row',
              overflowX: 'auto',
              gap: 2,
              pb: 2,
              width: '100%',
            }}
        >
          <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
          >
            <DragOverlay>
              {activeTask && (
                  <Box
                      sx={{
                        p: 1,
                        bgcolor: '#fff',
                        borderRadius: 1,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                  >
                    {activeTask.title}
                  </Box>
              )}
            </DragOverlay>
            {filteredColumns.map((column) => (
                <Box
                    key={column.id}
                    sx={{
                      flexGrow: 1,
                      flexBasis: 0,
                      minWidth: '280px',
                    }}
                >
                  <SortableContext
                      id={column.id}
                      items={column.tasks.map((task) => task.id)}
                      strategy={verticalListSortingStrategy}
                  >
                    <KanbanColumn
                        id={column.id}
                        title={column.title}
                        tasks={column.tasks}
                        onCardClick={handleCardClick}
                    />
                  </SortableContext>
                </Box>
            ))}
          </DndContext>
        </Box>
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
            {selectedTask && (
                <>
                  <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2D3A45' }}>
                      Publicação - {selectedTask.title}
                    </Typography>
                    <IconButton onClick={() => setIsModalOpen(false)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#2D3A45' }}>
                    <strong>Data de publicação no DJE:</strong> <br />
                    {new Date(selectedTask.date).toLocaleDateString('pt-BR')}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2, mb: 0.5, color: '#2D3A45' }}>
                    <strong>Autor:</strong>
                  </Typography>
                  <List dense sx={{ mb: 1 }}>
                    <ListItem sx={{ display: 'list-item', pl: 2 }}>
                      <Typography variant="body2" sx={{ color: '#2D3A45' }}>
                        {selectedTask.fullData.authors || 'N/A'}
                      </Typography>
                    </ListItem>
                  </List>
                  <Typography variant="body2" sx={{ mt: 2, mb: 0.5, color: '#2D3A45' }}>
                    <strong>Réu:</strong>
                  </Typography>
                  <List dense sx={{ mb: 1 }}>
                    <ListItem sx={{ display: 'list-item', pl: 2 }}>
                      <Typography variant="body2" sx={{ color: '#2D3A45' }}>
                        {selectedTask.fullData.defendant || 'N/A'}
                      </Typography>
                    </ListItem>
                  </List>
                  <Typography variant="body2" sx={{ mt: 2, mb: 0.5, color: '#2D3A45' }}>
                    <strong>Advogado(s):</strong>
                  </Typography>
                  <List dense sx={{ mb: 1 }}>
                    <ListItem sx={{ display: 'list-item', pl: 2 }}>
                      <Typography variant="body2" sx={{ color: '#2D3A45' }}>
                        {selectedTask.fullData.lawyers || 'N/A'}
                      </Typography>
                    </ListItem>
                  </List>
                  <Typography variant="body2" sx={{ mt: 2, color: '#2D3A45' }}>
                    <strong>Valor principal bruto/ líquido</strong> <br />
                    {selectedTask.fullData.gross_net_principal_amount
                        ? `R$ ${selectedTask.fullData.gross_net_principal_amount}`
                        : 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2, color: '#2D3A45' }}>
                    <strong>Valor dos juros moratórios:</strong> <br />
                    {selectedTask.fullData.late_interest_amount
                        ? `R$ ${selectedTask.fullData.late_interest_amount}`
                        : 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2, color: '#2D3A45' }}>
                    <strong>Valor dos honorários advocatícios:</strong> <br />
                    {selectedTask.fullData.attorney_fees
                        ? `R$ ${selectedTask.fullData.attorney_fees}`
                        : 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2, color: '#2D3A45' }}>
                    <strong>Conteúdo da Publicação:</strong> <br />
                    {selectedTask.fullData.content || 'N/A'}
                  </Typography>
                </>
            )}
          </Box>
        </Modal>
        <Snackbar
            open={snackbarOpen}
            onClose={() => setSnackbarOpen(false)}
            autoHideDuration={3000}
            message={snackbarMessage}
        />
      </>
  );
};

export default KanbanBoard;
