// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User মডেল ইম্পোর্ট করুন

// একটি JWT টোকেন তৈরি করার ফাংশন
const generateToken = (id, role) => {
    return jwt.sign({ user: { id, role } }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'Username already taken' });
        }

        user = new User({ username, email, password, role });
        await user.save(); // pre('save') হুক পাসওয়ার্ড হ্যাশ করবে

        const token = generateToken(user._id, user.role);
        res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during registration');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials: User not found' });
        }

        const isMatch = await user.matchPassword(password); // User মডেলের matchPassword মেথড ব্যবহার করুন
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials: Password incorrect' });
        }

        const token = generateToken(user._id, user.role);
        res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during login');
    }
});

module.exports = router;