require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
const eventRoutes = require('./routes/events');
const commentRoutes = require('./routes/comments');
const suggestionRoutes = require('./routes/suggestions');
const chatRoutes = require('./routes/chat');

app.use('/api/events', eventRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send('Tinku Calendar API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
