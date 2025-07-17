const Task = require('../models/Task');
const User = require('../models/User');
const { logAction } = require('./actionLogger');

// 🔹 GET all tasks for board (or project)
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('assignedTo', 'name') // Only fetch user name (optional, cleaner)
            .sort({ createdAt: -1 }); // Sort newest tasks first
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
        const populatedTask = await Task.findById(task._id).populate('assignedTo');
        res.status(201).json(populatedTask);
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

        const populatedTask = await Task.findById(updatedTask._id).populate('assignedTo');
        res.status(200).json(populatedTask);
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

// 🔹 SMART ASSIGN
exports.smartAssign = async (req, res) => {
    try {
        const users = await User.find();
        const priorityWeights = { 'Low': 1, 'Medium': 2, 'High': 3 };

        const activeTasks = await Task.find({
            status: { $in: ['Todo', 'In Progress'] },
            assignedTo: { $exists: true },
        });

        const userStats = users.map(user => {
            const userTasks = activeTasks.filter(task =>
                task.assignedTo?.toString() === user._id.toString()
            );

            const count = userTasks.length;
            const totalWeight = userTasks.reduce(
                (acc, task) => acc + (priorityWeights[task.priority] || 0),
                0
            );
            const avgWeight = count > 0 ? totalWeight / count : 0;

            return { user, count, totalWeight, avgWeight };
        });

        const minTaskCount = Math.min(...userStats.map(u => u.count));
        const candidates = userStats.filter(u => u.count === minTaskCount);
        const selectedUser = candidates.sort((a, b) => a.avgWeight - b.avgWeight)[0].user;

        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Prevent useless reassignment
        if (task.assignedTo?.toString() === selectedUser._id.toString()) {
            return res.status(200).json({
                message: `Already assigned to ${selectedUser.name}`,
                task: await Task.findById(task._id).populate('assignedTo'),
            });
        }

        task.assignedTo = selectedUser._id;
        await task.save();

        const updatedTask = await Task.findById(task._id).populate('assignedTo');

        return res.status(200).json({
            message: `Assigned to ${selectedUser.name}`,
            task: updatedTask,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
