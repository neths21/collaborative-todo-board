const Task = require('../models/Task');

// Create Task
exports.createTask = async (req, res) => {
    try {
        const { title, description, assignedUser, status, priority } = req.body;
        const task = await Task.create({ title, description, assignedUser, status, priority });
        
        const io = req.app.get('io');
        io.emit('task-created', task);

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create task' });
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        const io = req.app.get('io');
        io.emit('task-updated', task);

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update task' });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        await task.deleteOne();

        const io = req.app.get('io');
        io.emit('task-deleted', { id: req.params.id });

        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete task' });
    }
};
