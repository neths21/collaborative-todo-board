import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from './useAuth';

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data } = await api.get('/tasks', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setTasks(data);
            } catch (err) {
                console.error('Failed to fetch tasks:', err);
            }
        };
        if (user?.token) fetchTasks();
    }, [user]);

    return { tasks, setTasks };
};
