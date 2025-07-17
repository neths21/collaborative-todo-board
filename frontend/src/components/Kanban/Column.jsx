import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';

const Column = ({ status, tasks, id }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="kanban-column">
            <h3>{status}</h3>
            <div className="task-list">
                {tasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                ))}
            </div>
        </div>
    );
};

export default Column;
