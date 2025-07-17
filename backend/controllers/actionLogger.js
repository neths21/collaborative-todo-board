const ActionLog = require('../models/ActionLog');

exports.logAction = async ({ userId, userName, actionType, taskId, taskTitle, details }) => {
    try {
        await ActionLog.create({
            userId,
            userName,
            actionType,
            taskId,
            taskTitle,
            details,
        });
    } catch (error) {
        console.error('Failed to log action:', error);
    }
};
