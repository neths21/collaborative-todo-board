import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import api from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/TasksContext';
import { useUsers } from '../../hooks/useUsers';

const TaskCard = ({ task, onRefresh }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task._id });
    const { user } = useAuth();
    const { users } = useUsers();
    const { deleteTask, updateTask } = useTasks();

    const [loading, setLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [priority, setPriority] = useState(task.priority || 'Medium');
    const [assignedTo, setAssignedTo] = useState(task.assignedTo?._id || '');

    const style = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        cursor: 'grab',
        opacity: loading ? 0.5 : 1,
    };

    const handleSmartAssign = async () => {
        setLoading(true);
        try {
            await api.put(`/tasks/${task._id}/smart-assign`, {}, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            await onRefresh();
        } catch (err) {
            console.error(err);
            alert('Failed to assign task');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Delete this task?')) {
            await deleteTask(task._id);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await updateTask(task._id, {
            title,
            description,
            priority,
            assignedTo,
            updatedAt: task.updatedAt,
        });
        setShowUpdateModal(false);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="task-card"
            onClick={() => setShowDetails(!showDetails)}
        >
            <h4>{task.title}</h4>
            <div className="task-actions">
                <button className="small-button" onClick={(e) => { e.stopPropagation(); handleSmartAssign(); }}>
                    Smart Assign
                </button>
                <button className="small-button delete" onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
                    Delete
                </button>
                <button className="small-button update" onClick={(e) => { e.stopPropagation(); setShowUpdateModal(true); }}>
                    Update
                </button>
            </div>

            {showDetails && (
                <div className="task-details">
                    <p><strong>Description:</strong> {task.description || 'No description'}</p>
                    <p><strong>Priority:</strong> {task.priority}</p>
                    <p><strong>Assigned To:</strong> {task.assignedTo?.name || 'Unassigned'}</p>
                </div>
            )}

            {showUpdateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Update Task</h3>
                        <form onSubmit={handleUpdate}>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
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
                            <button type="submit">Update Task</button>
                            <button type="button" onClick={() => setShowUpdateModal(false)} className="cancel-button">
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskCard;
