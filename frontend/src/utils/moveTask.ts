import axios from 'axios';
import {Column} from '../types';

interface MoveTaskResult {
    updatedColumns: Column[];
    updatedFilteredColumns: Column[];
}

export const moveTask = async (
    event: { activeId: string; toColumnId: string; fromColumnId: string },
    columns: Column[],
): Promise<MoveTaskResult> => {
    const {activeId, toColumnId, fromColumnId} = event;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');

    try {
        await axios.put(
            `${API_BASE_URL}/auth/processes/${activeId}`,
            {status: toColumnId},
            {headers: {Authorization: `Bearer ${token}`}}
        );
    } catch (error: any) {
        console.error(
            'Erro ao atualizar processo no backend:',
            error.response?.data || error.message
        );
        throw new Error('Erro ao atualizar processo no backend.');
    }

    const updatedColumns = columns.map((col) => {
        if (col.id === fromColumnId) {
            return {...col, tasks: col.tasks.filter((t) => t.id !== activeId)};
        }
        if (col.id === toColumnId) {
            const movedTask = columns
                .find((c) => c.id === fromColumnId)
                ?.tasks.find((t) => t.id === activeId);
            if (movedTask) {
                return {...col, tasks: [...col.tasks, {...movedTask, columnId: toColumnId}]};
            }
        }
        return col;
    });

    return {updatedColumns, updatedFilteredColumns: updatedColumns};
};
