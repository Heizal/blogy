const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

//Middleware to parse json
app.use(express.json());
// Export app for testing purposes
module.exports = app;

//Basic route
app.get('/', (req, res) => {
    res.status(200).send('Blog platform backend is running');
});

// Start the server only if it's not in a test environment
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}