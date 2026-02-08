const express = require('express');
const router = express.Router();
const DayComment = require('../models/DayComment');

// GET comments for a specific date
router.get('/:date', async (req, res) => {
    try {
        const comments = await DayComment.find({ date: req.params.date }).sort({ timestamp: 1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new comment
router.post('/', async (req, res) => {
    const comment = new DayComment({
        date: req.body.date,
        content: req.body.content,
        author: req.body.author
    });

    try {
        const newComment = await comment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
