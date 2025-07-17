import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from './useAuth';

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const { user } = useAuth();

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/tasks', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setTasks(data);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
        }
    };

    const createTask = async (taskData) => {
        try {
            await api.post('/tasks', taskData, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            await fetchTasks();
        } catch (err) {
            console.error('Failed to create task:', err);
        }
    };

    const updateTask = async (taskId, updates) => {
        try {
            await api.put(`/tasks/${taskId}`, updates, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            await fetchTasks();
        } catch (err) {
            if (err.response?.status === 409) {
                alert('Conflict: Another user updated this task recently.');
                await fetchTasks();
            } else {
                console.error('Failed to update task:', err);
            }
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await api.delete(`/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            await fetchTasks();
        } catch (err) {
            console.error('Failed to delete task:', err);
        }
    };

    useEffect(() => {
        if (user?.token) fetchTasks();
    }, [user]);

    return (
        <TasksContext.Provider value={{ tasks, setTasks, fetchTasks, createTask, updateTask, deleteTask }}>
            {children}
        </TasksContext.Provider>
    );
};

export function useTasks() {
    return useContext(TasksContext);
}
