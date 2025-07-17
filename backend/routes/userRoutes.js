const express = require('express');
const User = require('../models/User');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, async (req, res) => {
    try {
        const users = await User.find().select('_id name');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
