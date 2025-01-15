import React, {useEffect, useState} from 'react';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {Box, Snackbar} from '@mui/material';
import KanbanColumn from '../components/KanbanColumn';
import KanbanHeader from '../components/KanbanHeader';
import TaskDetailsModal from '../components/TaskModal';
import {Column, Task} from '../types';
import {filterColumns} from '../utils/filterTasks';
import {moveTask} from '../utils/moveTask';
import {useProcesses} from '../hooks/useProcesses';

const KanbanBoard: React.FC = () => {
    const {columns, setColumns} = useProcesses();
    const [filteredColumns, setFilteredColumns] = useState<Column[]>([]);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: {distance: 10}})
    );

    useEffect(() => {
        setFilteredColumns(columns);
    }, [columns]);

    const handleSearch = (searchTerm: string, fromDate: string, toDate: string) => {
        const filtered = filterColumns(columns, searchTerm, fromDate, toDate);
        setFilteredColumns(filtered);
    };

    const handleCardClick = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleDragStart = (event: DragStartEvent) => {
        const {active} = event;
        const activeId = active.id;
        const task = columns.flatMap((column) => column.tasks).find((t) => t.id === activeId);
        setActiveTask(task || null);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const {active, over} = event;
        if (!over) {
            setActiveTask(null);
            return;
        }

        const activeId = String(active.id);

        let toColumnId: string | undefined;
        const columnDirect = columns.find(col => col.id === String(over.id));
        if (columnDirect) {
            toColumnId = columnDirect.id;
        } else {
            const cardColumn = columns.find(col => col.tasks.some(task => task.id === String(over.id)));
            toColumnId = cardColumn?.id;
        }

        const fromColumn = columns.find(col => col.tasks.some(task => task.id === activeId));
        const fromColumnId = fromColumn?.id;

        if (!toColumnId || !fromColumnId || !activeId) {
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
            const result = await moveTask({activeId, toColumnId, fromColumnId}, columns);
            setColumns(result.updatedColumns);
            setFilteredColumns(result.updatedFilteredColumns);
        } catch (error: any) {
            setSnackbarMessage('Erro ao atualizar processo no backend.');
            setSnackbarOpen(true);
        }
        setActiveTask(null);
    };


    return (
        <>
            <KanbanHeader onSearch={handleSearch}/>
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
            <TaskDetailsModal
                task={selectedTask}
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
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
