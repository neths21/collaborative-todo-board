// src/hooks/useUsers.js
import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from './useAuth';

export const useUsers = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/users', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setUsers(data);
            } catch (err) {
                console.error('Failed to fetch users', err);
            }
        };
        if (user?.token) fetchUsers();
    }, [user]);

    return { users };
};
