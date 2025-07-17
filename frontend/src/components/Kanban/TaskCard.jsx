const TaskCard = ({ title }) => {
    return (
        <div className="task-card">
            <p>{title}</p>
            <button>Smart Assign</button>
        </div>
    );
};

export default TaskCard;
