const express = require('express');
const router = express.Router();
const ActionLog = require('../models/ActionLog');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const logs = await ActionLog.find()
            .sort({ createdAt: -1 })
            .limit(limit);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
