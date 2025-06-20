const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
// Check if the environment variable is loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI);
const connectDB = require('./db');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const requireAuth = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const boardsRoutes = require('./routes/boards');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

// Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,     // take secret in .env
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,                      // true only for HTTPS in production
        maxAge: 1000 * 60 * 60 * 24         // 1 day
    }
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'preloader.html'));
});

// Blocks direct access to index.html without authorization
app.get('/index.html', (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/auth.html');
    }
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// Blocks direct access to auth.html if the user is already logged in
app.get('/auth.html', (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('/index.html');
    }
    res.sendFile(path.join(__dirname, '..', 'client', 'auth.html'));
});

//app.use(express.static('../client')); // return frontend
app.use(express.static(path.join(__dirname, '..', 'client'))); // return frontend

// Font Awesome:
app.use('/fa', express.static(path.join(__dirname, '..', 'node_modules', '@fortawesome', 'fontawesome-free')));

// Routes:
app.use('/api/auth', authRoutes);      // authentication
app.use('/api', protectedRoutes);      // protected routes (example - /api/profile)
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
    res.json({ status: 'ok', userId: req.session.userId }); // test
});

// Test: set session value
app.get('/api/session/set', (req, res) => {
    req.session.testValue = 'Session is working!';
    res.json({ message: 'Session value set' });
});

// Test: get session value
app.get('/api/session/get', (req, res) => {
    const value = req.session.testValue;
    res.json({ sessionValue: value || 'No session value found' });
});

// Protected route
app.get('/api/protected', requireAuth, (req, res) => {
    res.json({ message: `Welcome! You are authenticated as user ${req.session.userId}` });
});

app.use('/api/boards', boardsRoutes);

// 404
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, '..', 'client', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
