// src/components/KanbanBoard.tsx
import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import { Task, Column } from '../types'; // Certifique-se de que ../types existe ou defina as interfaces localmente

// Função auxiliar para mover itens de forma imutável
const arrayMove = <T,>(array: T[], fromIndex: number, toIndex: number): T[] => {
  const newArray = array.slice();
  const [movedItem] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, movedItem);
  return newArray;
};

interface ActiveTask {
  columnId: string;
  task: Task;
}

const KanbanBoard: React.FC = () => {
  // Estado das colunas iniciais
  const [columns, setColumns] = useState<Column[]>([
    { id: 'col-1', title: 'Backlog', tasks: [{ id: '1', title: 'Tarefa 1' }] },
    { id: 'col-2', title: 'To Do', tasks: [{ id: '2', title: 'Tarefa 2' }] },
    { id: 'col-3', title: 'In Progress', tasks: [{ id: '3', title: 'Tarefa 3' }] },
    { id: 'col-4', title: 'Done', tasks: [{ id: '4', title: 'Tarefa 4' }] },
  ]);

  // Estado para o item ativo no arraste
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);

  // Callback ao iniciar o drag
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = String(active.id); // Converte para string
    let found: ActiveTask | null = null;
    columns.forEach((column) => {
      column.tasks.forEach((task) => {
        if (task.id === activeId) {
          found = { columnId: column.id, task };
        }
      });
    });
    setActiveTask(found);
  };

  // Callback ao terminar o drag
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null); // Limpa o overlay
    if (!over) return;

    const activeId = String(active.id); // Converte para string
    let overId = String(over.id);       // Converte para string

    // Se o overId for de uma coluna (começa com "col-"), então
    // assumimos que o drop ocorreu no final dessa coluna
    const isOverColumn = overId.startsWith('col-');
    let overColumnIndex = -1;
    let overTaskIndex = -1;

    let activeColumnIndex = -1;
    let activeTaskIndex = -1;
    columns.forEach((column, colIndex) => {
      column.tasks.forEach((task, taskIndex) => {
        if (task.id === activeId) {
          activeColumnIndex = colIndex;
          activeTaskIndex = taskIndex;
        }
      });
    });

    if (!isOverColumn) {
      columns.forEach((column, colIndex) => {
        column.tasks.forEach((task, taskIndex) => {
          if (task.id === overId) {
            overColumnIndex = colIndex;
            overTaskIndex = taskIndex;
          }
        });
      });
    } else {
      columns.forEach((column, colIndex) => {
        if (column.id === overId) {
          overColumnIndex = colIndex;
          overTaskIndex = column.tasks.length; // inserir no final
        }
      });
    }

    console.log('DragEnd - active:', activeId, 'over:', overId);
    console.log('Indices:', { activeColumnIndex, activeTaskIndex, overColumnIndex, overTaskIndex });
    if (
      activeColumnIndex === -1 ||
      overColumnIndex === -1 ||
      activeTaskIndex === -1 ||
      typeof overTaskIndex !== 'number'
    ) {
      console.warn('Índices não encontrados corretamente');
      return;
    }

    const updatedColumns = columns.map(column => ({
      ...column,
      tasks: [...column.tasks],
    }));

    if (activeColumnIndex === overColumnIndex) {
      updatedColumns[activeColumnIndex].tasks = arrayMove(
        updatedColumns[activeColumnIndex].tasks,
        activeTaskIndex,
        overTaskIndex
      );
    } else {
      const sourceTasks = updatedColumns[activeColumnIndex].tasks;
      const [movedTask] = sourceTasks.splice(activeTaskIndex, 1);
      updatedColumns[activeColumnIndex].tasks = sourceTasks;

      const targetTasks = updatedColumns[overColumnIndex].tasks;
      targetTasks.splice(overTaskIndex, 0, movedTask);
      updatedColumns[overColumnIndex].tasks = targetTasks;
    }
    console.log('Estado atualizado:', updatedColumns);
    setColumns(updatedColumns);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* Render DragOverlay para exibir a cópia do card enquanto arrasta */}
      <DragOverlay>
        {activeTask ? (
          <div
            style={{
              padding: '8px',
              border: '1px solid #4caf50',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
          >
            <strong>{activeTask.task.title}</strong>
          </div>
        ) : null}
      </DragOverlay>
      <div style={{ display: 'flex', gap: '16px', padding: '16px', position: 'relative' }}>
        {columns.map((column) => (
          <SortableContext
            key={column.id}
            items={column.tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <KanbanColumn id={column.id} title={column.title} tasks={column.tasks} />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
