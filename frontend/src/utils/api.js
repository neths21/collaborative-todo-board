import axios from 'axios';

const api = axios.create({
    baseURL: "https://collaborative-todo-board-2.onrender.com/api/"
});

export default api;
