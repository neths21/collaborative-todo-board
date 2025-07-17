import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from './useAuth';
import { io } from 'socket.io-client';

export const useLogs = () => {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const { data } = await api.get('/logs', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setLogs(data);
            } catch (err) {
                console.error('Failed to fetch logs:', err);
            }
        };

        if (user?.token) fetchLogs();

        const socket = io('http://localhost:5000');
        socket.on('new-log', (log) => {
            setLogs((prev) => [log, ...prev.slice(0, 19)]);
        });

        return () => socket.disconnect();
    }, [user]);

    return { logs };
};
