const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const authenticateAdmin = require('../middleware/auth');

// Multer setup for temporary file storage
const upload = multer({ dest: 'uploads/' });

// Helper to upload to ImgBB
const uploadToImgBB = async (filePath) => {
    const image = fs.readFileSync(filePath);
    const form = new FormData();
    form.append('image', image.toString('base64'));

    try {
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, form, {
            headers: form.getHeaders(),
        });
        return response.data.data.url;
    } catch (error) {
        console.error('ImgBB Upload Error:', error.response?.data || error.message);
        throw new Error('Image upload failed');
    } finally {
        // Clean up local file
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
};

// GET all events (Public)
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ start: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new event (Protected)
router.post('/', authenticateAdmin, upload.single('image'), async (req, res) => {
    try {
        let imageUrl = '';
        if (req.file) {
            imageUrl = await uploadToImgBB(req.file.path);
        } else if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl; // Allow direct URL if provided
        }

        const event = new Event({
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
            location: req.body.location,
            description: req.body.description,
            imageUrl: imageUrl,
            createdBy: req.body.createdBy || 'admin'
        });

        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE event (Protected)
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        await event.deleteOne();
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE event (Protected)
router.put('/:id', authenticateAdmin, async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
