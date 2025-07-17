import { useDraggable } from '@dnd-kit/core';

const TaskCard = ({ task }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task._id,
    });

    const style = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="task-card">
            <p>{task.title}</p>
            <button>Smart Assign</button>
        </div>
    );
};

export default TaskCard;
