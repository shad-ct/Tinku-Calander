const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: 'User'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
