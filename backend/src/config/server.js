// config/server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
const postRoutes = require('../routes/postRoutes');
const authRoutes = require('../routes/authRoutes');
const commentRoutes = require('../routes/commentRoutes');

app.use('/api', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', commentRoutes);

// Verify server is running
app.get('/', (req, res) => {
    res.status(200).send('Blog platform backend is running');
});

// Function to start the server
const startServer = () => {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

module.exports = { app, startServer, connectDB };
