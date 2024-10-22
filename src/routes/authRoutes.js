const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

//User registration
router.post(
    '/register',
    [
        //Validate input
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Email is invalid'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be atleast 6 characters long')
    ],
    async (res, req) =>{
        //Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }
        const { username, email, password } = req.body;

        try{
            //Check if user already exists
            let user = await User.findOne({ email })
            if (user){
                return res.status(400).json({ msg: 'User already esists' })
            }

            //Create new user
            user = new User({ username, email, password });

            //Save user to database
            await user.save();

            //Generate JWT token
            const payload = { userId: user._id };
            const token = jwt.sign(payload, process.env.JWT_SERCRET, {
                expiresIn: '1h',
            });

            res.status(201).json({ token })

        } catch(error){
            console.error(error.message);
            res.status(500).send('Server error')
        }
    }
);

//User login
router.post(
    '/login',
    [
      // Validate input
      body('email').isEmail().withMessage('Email is invalid'),
      body('password').exists().withMessage('Password is required'),
    ],
    async (res, req) => {
      // Handle validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const { email, password } = req.body;
  
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ msg: 'Invalid credentials' });
        }
  
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid credentials' });
        }
  
        // Generate JWT token
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });
  
        res.json({ token });
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
      }
    }
  );

module.exports = router;