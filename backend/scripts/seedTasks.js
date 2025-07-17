const mongoose = require('mongoose');
require('dotenv').config();
const Task = require('../models/Task');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected for seeding...'))
    .catch(err => console.error(err));

// Sample tasks
const sampleTasks = [
    {
        title: 'Setup Project Repo',
        description: 'Create initial GitHub repo for project.',
        status: 'Todo',
        priority: 'High',
    },
    {
        title: 'Create Login API',
        description: 'Implement register and login functionality.',
        status: 'In Progress',
        priority: 'Medium',
    },
    {
        title: 'Deploy Backend to Render',
        description: 'Deploy Node.js backend to Render free tier.',
        status: 'Done',
        priority: 'Low',
    },
    {
        title: 'Design Kanban UI',
        description: 'Rough draft of UI layout for Kanban board.',
        status: 'Todo',
        priority: 'High',
    }
];

// Insert tasks
const seedTasks = async () => {
    try {
        await Task.deleteMany(); // Clear existing tasks if needed
        await Task.insertMany(sampleTasks);
        console.log('✅ Sample tasks seeded successfully.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedTasks();
