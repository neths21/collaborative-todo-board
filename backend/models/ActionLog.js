const mongoose = require('mongoose');

const ActionLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    actionType: String,
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    taskTitle: String,
    details: String,
}, { timestamps: true }); // ✅ This auto-creates createdAt

module.exports = mongoose.model('ActionLog', ActionLogSchema);
