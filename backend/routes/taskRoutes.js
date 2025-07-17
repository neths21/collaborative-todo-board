const express = require('express');
const {
    createTask,
    updateTask,
    deleteTask,
    getTasks,
    smartAssign
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getTasks)
    .post(protect, createTask);

router.put('/:id/smart-assign', protect, smartAssign);

router.route('/:id')
    .put(protect, updateTask)
    .delete(protect, deleteTask);

module.exports = router;
