const ActionLog = require('../models/ActionLog');

exports.logAction = async ({ userId, userName, actionType, taskId, taskTitle, details, req }) => {
    try {
        const createdLog = await ActionLog.create({
            userId,
            userName,
            actionType,
            taskId,
            taskTitle,
            details,
        });

        // Emit log via socket.io
        if (req && req.app) {
            const io = req.app.get('io');
            io.emit('new-log', createdLog);
        }
    } catch (error) {
        console.error('Failed to log action:', error);
    }
};
