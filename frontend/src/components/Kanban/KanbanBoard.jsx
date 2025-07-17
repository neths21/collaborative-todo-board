import Column from './Column';

const KanbanBoard = () => {
    return (
        <div className="kanban-board">
            <Column status="Todo" />
            <Column status="In Progress" />
            <Column status="Done" />
        </div>
    );
};

export default KanbanBoard;
