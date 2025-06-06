const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Registration
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check for an existing user by username or email
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create and save a new user
        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Log In
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Search user by username
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Set userId to session
        if (!req.session) {
            return res.status(500).json({ message: 'Session not initialized' });
        }
        req.session.userId = user._id;

        res.status(200).json({ message: 'Logged in successfully' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Log out
router.post('/logout', (req, res) => {
    if (!req.session) {
        return res.status(400).json({ message: 'Not logged in' });
    }

    req.session.destroy((err) => {
        if (err) {
            console.error('❌ Logout error:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

module.exports = router;
