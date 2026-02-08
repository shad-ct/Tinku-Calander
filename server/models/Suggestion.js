const mongoose = require('mongoose');

const SuggestionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    suggestedDate: {
        type: Date
    },
    votes: {
        type: Number,
        default: 0
    },
    votedIps: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Suggestion', SuggestionSchema);
