const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');

router.get('/profile', requireAuth, (req, res) => {
    res.status(200).json({ message: 'Welcome to your profile!' });
});

module.exports = router;
