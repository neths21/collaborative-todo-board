const ActionLog = require('../models/ActionLog');

async function logAction({ userId, userName, actionType, taskId, taskTitle, details }) {
    try {
        await ActionLog.create({
            userId,
            userName,
            actionType,
            taskId,
            taskTitle,
            details
        });
    } catch (err) {
        console.error('Failed to log action:', err.message);
    }
}

module.exports = { logAction };
