import TaskCard from './TaskCard';

const Column = ({ status }) => {
    return (
        <div className="kanban-column">
            <h3>{status}</h3>
            <div className="task-list">
                {/* Dummy task for now */}
                <TaskCard title="Sample Task" />
            </div>
        </div>
    );
};

export default Column;
