import {useEffect, useState} from 'react';
import axios from 'axios';
import {Column} from '../types';

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
    new: {id: 'new', title: 'Publicações Novas'},
    read: {id: 'read', title: 'Publicações Lidas'},
    lawyer: {id: 'lawyer', title: 'Publicações Enviadas para ADV'},
    completed: {id: 'completed', title: 'Concluídas'},
};

export const useProcesses = () => {
    const [columns, setColumns] = useState<Column[]>([]);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchProcesses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }
                const response = await axios.get(`${API_BASE_URL}/auth/list-cards`, {
                    headers: {Authorization: `Bearer ${token}`},
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
                    // Extrai o id corretamente, independentemente do formato
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
            } catch (error: any) {
                if (
                    error.response &&
                    (error.response.status === 401 || error.response.status === 403)
                ) {
                    if (window.location.pathname !== '/login') {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }
                    return;
                }
                console.error('Erro ao buscar processos:', error);
            }
        };

        fetchProcesses();
    }, [API_BASE_URL]);

    return {columns, setColumns};
};
