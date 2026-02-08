const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');

// GET recent chat messages
router.get('/', async (req, res) => {
    try {
        const messages = await ChatMessage.find().sort({ timestamp: -1 }).limit(50);
        res.json(messages.reverse()); // Send oldest first for the chat window
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new message
router.post('/', async (req, res) => {
    const message = new ChatMessage({
        content: req.body.content,
        author: req.body.author,
        ipAddress: req.ip  // Capture IP
    });

    try {
        const newMessage = await message.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
