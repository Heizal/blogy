// app.js
const dotenv = require('dotenv');
dotenv.config();
const { startServer, connectDB } = require('./src/config/server');

// Connect to MongoDB and then start the server
if (process.env.NODE_ENV !== 'test') {
    connectDB(); // Connect to the database
    startServer(); // Start the server
}

module.exports = require('./src/config/server').app; // Export the app for testing
