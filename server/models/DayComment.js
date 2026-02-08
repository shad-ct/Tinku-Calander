const mongoose = require('mongoose');

const DayCommentSchema = new mongoose.Schema({
    date: {
        type: String, // Storing as YYYY-MM-DD string for easy lookup
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: 'Anonymous'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DayComment', DayCommentSchema);
