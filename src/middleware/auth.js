const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from database using decoded _id from token
        const user = await User.findById(decoded._id);
        
        if (!user) {
            throw new Error();
        }
        
        req.user = user;  // Set user in request for further access
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate' });
    }
};

module.exports = auth;