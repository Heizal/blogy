const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

app.use(express.json());
module.exports = app;

//Verify server is running
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

//Connect MONGODB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>{
    console.log('Connected to MongoDB');
}).catch(err =>{
    console.error('Error connecting to MongoDB', err);
});

//Post routes
const postRoutes = require('./routes/postRoutes');
app.use('/api', postRoutes)