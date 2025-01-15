import { Column } from '../types';

export const filterColumns = (
    columns: Column[],
    searchTerm: string,
    fromDate: string,
    toDate: string
): Column[] => {
    return columns.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => {
            const matchesSearch = task.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const taskDate = new Date(task.date);
            const matchesFromDate = !fromDate || taskDate >= new Date(fromDate);
            const matchesToDate = !toDate || taskDate <= new Date(toDate);
            return matchesSearch && matchesFromDate && matchesToDate;
        }),
    }));
};