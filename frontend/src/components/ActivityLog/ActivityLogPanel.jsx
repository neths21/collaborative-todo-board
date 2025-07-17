import { useEffect, useRef } from 'react';
import { useLogs } from '../../hooks/useLogs';

const ActivityLogPanel = () => {
    const { logs } = useLogs();
    const listRef = useRef(null);

    useEffect(() => {
        listRef.current?.scrollTo(0, 0); // Always scroll to top (newest first)
    }, [logs]);

    return (
        <div className="activity-log-panel">
            <h3>Activity Log (Last 20)</h3>
            <ul ref={listRef}>
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
