import {useCallback} from 'react';

export const useAuth = () => {
    const getToken = useCallback(() => {
        return localStorage.getItem('token');
    }, []);

    const handleAuthError = useCallback((error: any) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (window.location.pathname !== '/login') {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            return true;
        }
        return false;
    }, []);

    return {getToken, handleAuthError};
};