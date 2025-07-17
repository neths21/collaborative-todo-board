const Task = require('../models/Task');
const { logAction } = require('./actionLogger');

// 🔹 GET all tasks for board (or project)
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 CREATE a task
exports.createTask = async (req, res) => {
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
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 UPDATE a task (status, title, description, assignedTo, priority)
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Conflict Check
        const clientUpdatedAt = new Date(req.body.updatedAt);
        if (task.updatedAt > clientUpdatedAt) {
            return res.status(409).json({
                message: 'Conflict detected. Task was updated by someone else.',
                serverTask: task
            });
        }

        Object.assign(task, req.body);
        const updatedTask = await task.save();

        await logAction({
            userId: req.user.id,
            userName: req.user.name,
            actionType: 'UPDATE_TASK',
            taskId: updatedTask._id,
            taskTitle: updatedTask.title,
            details: `Updated fields: ${Object.keys(req.body).join(', ')}`
        });

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// 🔹 DELETE a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await Task.findByIdAndDelete(req.params.id);

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
        res.status(500).json({ message: 'Server Error' });
    }
};

//smart assign
const User = require('../models/User');
const Task = require('../models/Task');
const { logAction } = require('./actionLogger');

// Smart Assign Controller
exports.smartAssign = async (req, res) => {
    try {
        // Get all users
        const users = await User.find();

        // For each user, count active tasks (Todo or In Progress)
        const userTaskCounts = await Promise.all(
            users.map(async (user) => {
                const count = await Task.countDocuments({
                    assignedTo: user._id,
                    status: { $in: ['Todo', 'In Progress'] }
                });
                return { user, count };
            })
        );

        // Find user with fewest active tasks
        const sorted = userTaskCounts.sort((a, b) => a.count - b.count);
        const selectedUser = sorted[0].user;

        // Assign this task to them
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.assignedTo = selectedUser._id;
        await task.save();

        await logAction({
            userId: req.user.id,
            userName: req.user.name,
            actionType: 'ASSIGN_TASK',
            taskId: task._id,
            taskTitle: task.title,
            details: `Smart Assigned to ${selectedUser.name}`
        });

        res.status(200).json({ message: `Assigned to ${selectedUser.name}`, task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
