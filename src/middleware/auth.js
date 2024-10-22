const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ error: 'Please authenticate' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');

        // Fetch user from database using decoded _id from token
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).send({ error: 'User not found' });
        }
        
        req.user = user;  // Set user in request for further access
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        res.status(401).send({ error: 'Please authenticate' });
    }
};

module.exports = auth;