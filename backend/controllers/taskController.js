const Task = require('../models/Task');
const { logAction } = require('./actionLogger');

const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        await logAction({
            userId: req.user.id,
            userName: req.user.name,
            actionType: 'CREATE_TASK',
            taskId: task._id,
            taskTitle: task.title,
            details: 'Task created in Todo'
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        await logAction({
            userId: req.user.id,
            userName: req.user.name,
            actionType: 'UPDATE_TASK',
            taskId: task._id,
            taskTitle: task.title,
            details: `Updated task fields: ${Object.keys(req.body).join(', ')}`
        });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        await logAction({
            userId: req.user.id,
            userName: req.user.name,
            actionType: 'DELETE_TASK',
            taskId: task._id,
            taskTitle: task.title,
            details: 'Task deleted'
        });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

