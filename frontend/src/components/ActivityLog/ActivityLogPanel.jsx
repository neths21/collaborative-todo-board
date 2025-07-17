import { useLogs } from '../../hooks/useLogs';

const ActivityLogPanel = () => {
    const { logs } = useLogs();

    return (
        <div className="activity-log-panel">
            <h3>Activity Log (Last 20)</h3>
            <ul>
                {logs.map((log) => (
                    <li key={log._id}>
                        [{new Date(log.createdAt).toLocaleTimeString()}] {log.userName} - {log.actionType}: {log.taskTitle} ({log.details})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivityLogPanel;
