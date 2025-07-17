import { useTasks } from '../../hooks/TasksContext';

const ConflictModal = () => {
    const { conflict, setConflict, updateTask } = useTasks();

    if (!conflict) return null;

    const handleOverwrite = async () => {
        await updateTask(conflict.taskId, conflict.clientTask, true);
        setConflict(null);
    };

    const handleCancel = async () => {
        setConflict(null);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Conflict Detected</h3>
                <p>Your version:</p>
                <pre>{JSON.stringify(conflict.clientTask, null, 2)}</pre>
                <p>Server version:</p>
                <pre>{JSON.stringify(conflict.serverTask, null, 2)}</pre>
                <button onClick={handleOverwrite}>Overwrite with my changes</button>
                <button onClick={handleCancel} className="cancel-button">Cancel</button>
            </div>
        </div>
    );
};

export default ConflictModal;
