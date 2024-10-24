// app.js
const dotenv = require('dotenv');
dotenv.config();
const { startServer, connectDB } = require('./config/server');

if (process.env.NODE_ENV !== 'test') {
    connectDB(); // Connect to the database
    startServer(); // Start the server
}

module.exports = require('./config/server').app; // Export the app for testing