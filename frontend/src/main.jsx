import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/globals.css';
import { AuthProvider } from './hooks/useAuth.jsx';
import { TasksProvider } from './hooks/TasksContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <TasksProvider>
                <App />
            </TasksProvider>
        </AuthProvider>
    </React.StrictMode>
);
