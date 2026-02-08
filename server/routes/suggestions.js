const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');

// GET all suggestions
router.get('/', async (req, res) => {
    try {
        const suggestions = await Suggestion.find().sort({ votes: -1, createdAt: -1 });
        res.json(suggestions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new suggestion
router.post('/', async (req, res) => {
    const suggestion = new Suggestion({
        title: req.body.title,
        description: req.body.description,
        suggestedDate: req.body.suggestedDate
    });

    try {
        const newSuggestion = await suggestion.save();
        res.status(201).json(newSuggestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPVOTE suggestion
router.patch('/:id/vote', async (req, res) => {
    try {
        const suggestion = await Suggestion.findById(req.params.id);
        if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });

        const userIp = req.ip;

        // Check if IP has already voted
        if (suggestion.votedIps && suggestion.votedIps.includes(userIp)) {
            return res.status(403).json({ message: 'You have already voted for this suggestion from this IP.' });
        }

        suggestion.votes += 1;
        suggestion.votedIps.push(userIp); // Record IP

        await suggestion.save();
        res.json(suggestion);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE status (Admin)
router.patch('/:id/status', async (req, res) => {
    try {
        const suggestion = await Suggestion.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(suggestion);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
