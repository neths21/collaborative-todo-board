const Task = require('../models/Task');

// Create Task
exports.createTask = async (req, res) => {
    try {
        const { title, description, assignedUser, status, priority } = req.body;
        const task = await Task.create({ title, description, assignedUser, status, priority });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create task', error: error.message });
    }
};

// Get All Tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedUser', 'name email');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update task', error: error.message });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete task', error: error.message });
    }
};
