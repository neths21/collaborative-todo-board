const ActionLog = require('../models/ActionLog');

exports.logAction = async (logData) => {
    const log = await ActionLog.create(logData);

    try {
        const io = require('../server').io;
        if (io) io.emit('new-log', log);
    } catch (err) {
        console.error('Socket.IO not initialized:', err);
    }
};

// Optional: GET latest logs for activity panel
exports.getActionLogs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const logs = await ActionLog.find().sort({ createdAt: -1 }).limit(limit);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
