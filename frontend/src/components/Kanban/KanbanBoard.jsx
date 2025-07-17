import { useState } from 'react';
import Column from './Column';
import { useTasks } from '../../hooks/TasksContext';
import { useUsers } from '../../hooks/useUsers';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import ConflictModal from '../Conflict/ConflictModal';
import ActivityLogPanel from '../ActivityLog/ActivityLogPanel';

const KanbanBoard = () => {
    const { tasks, fetchTasks, createTask, updateTask } = useTasks();
    const { users } = useUsers();

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Todo');
    const [priority, setPriority] = useState('Medium');
    const [assignedTo, setAssignedTo] = useState('');
    const [activeTask, setActiveTask] = useState(null);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        await createTask({ title, description, status, priority, assignedTo });
        setTitle('');
        setDescription('');
        setStatus('Todo');
        setPriority('Medium');
        setAssignedTo('');
        setShowModal(false);
    };

    const handleDragStart = (event) => {
        const task = tasks.find((t) => t._id === event.active.id);
        setActiveTask(task);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveTask(null);
        if (!over) return;

        const taskId = active.id;
        const newStatus = over.id;
        const draggedTask = tasks.find((task) => task._id === taskId);

        await updateTask(taskId, {
            status: newStatus,
            updatedAt: draggedTask.updatedAt,
        });
    };

    return (
        <>
            <h2 className="kanban-header">Task Board</h2>

            <div className="kanban-page-container">
                <ActivityLogPanel />

                <div className="kanban-main-board">
                    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                        <div className="kanban-board">
                            {['Todo', 'In Progress', 'Done'].map((status) => (
                                <Column
                                    key={status}
                                    id={status}
                                    status={status}
                                    tasks={tasks.filter((task) => task.status === status)}
                                    onRefresh={fetchTasks}
                                />
                            ))}
                        </div>

                        <DragOverlay>
                            {activeTask ? (
                                <div className="task-card drag-overlay">
                                    <h4>{activeTask.title}</h4>
                                    <p>{activeTask.description}</p>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>

                    <button className="open-modal-button" onClick={() => setShowModal(true)}>
                        + Add Task
                    </button>

                    {showModal && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h3>Create New Task</h3>
                                <form onSubmit={handleCreate}>
                                    <input
                                        type="text"
                                        placeholder="Task Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Description (optional)"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option>Todo</option>
                                        <option>In Progress</option>
                                        <option>Done</option>
                                    </select>
                                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                    <label>Assign To:</label>
                                    <select
                                        value={assignedTo}
                                        onChange={(e) => setAssignedTo(e.target.value)}
                                    >
                                        <option value="">Unassigned</option>
                                        {users.map((user) => (
                                            <option key={user._id} value={user._id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button type="submit">Add Task</button>
                                    <button type="button" onClick={() => setShowModal(false)} className="cancel-button">
                                        Cancel
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConflictModal />
        </>
    );
};

export default KanbanBoard;
