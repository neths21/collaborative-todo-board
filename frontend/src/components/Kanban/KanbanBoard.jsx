import Column from './Column';
import { useTasks } from '../../hooks/useTasks';
import { DndContext } from '@dnd-kit/core';
import api from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';

const KanbanBoard = () => {
    const { tasks, setTasks } = useTasks();
    const { user } = useAuth();

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) return; // No target column

        const taskId = active.id;
        const newStatus = over.id;

        try {
            const { data } = await api.put(`/tasks/${taskId}`, {
                status: newStatus,
                updatedAt: new Date(),
            }, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            setTasks((prev) =>
                prev.map((task) =>
                    task._id === taskId ? { ...task, status: newStatus } : task
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="kanban-board">
                {['Todo', 'In Progress', 'Done'].map((status) => (
                    <Column
                        key={status}
                        id={status}
                        status={status}
                        tasks={tasks.filter((task) => task.status === status)}
                    />
                ))}
            </div>
        </DndContext>
    );
};

export default KanbanBoard;
