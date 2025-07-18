import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import KanbanPage from './pages/KanbanPage';
import { useAuth } from './hooks/useAuth';

function AppRoutes() {
    const { user } = useAuth();
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/kanban" element={user ? <KanbanPage /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/kanban" />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default App;
