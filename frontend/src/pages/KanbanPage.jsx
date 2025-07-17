import KanbanBoard from "../components/Kanban/KanbanBoard";
import ActivityLogPanel from "../components/ActivityLog/ActivityLogPanel";

const KanbanPage = () => {
    return (
        <div className="kanban-page-container">
            <ActivityLogPanel />
            <div className="kanban-main-board">
                <KanbanBoard />
            </div>
        </div>
    );
};

export default KanbanPage;
