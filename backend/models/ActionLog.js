const mongoose = require('mongoose');

const ActionLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    actionType: { type: String, required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    taskTitle: { type: String },
    details: { type: String },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ActionLog', ActionLogSchema);
