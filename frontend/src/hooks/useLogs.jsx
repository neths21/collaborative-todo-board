import { useEffect, useState } from 'react';
import api from '../utils/api';
import { io } from 'socket.io-client';

export const useLogs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const { data } = await api.get('/logs');
                setLogs(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchLogs();

        const socket = io('http://localhost:5000');
        socket.on('new-log', (log) => {
            setLogs((prev) => [log, ...prev.slice(0, 19)]);
        });

        return () => socket.disconnect();
    }, []);

    return { logs };
};
