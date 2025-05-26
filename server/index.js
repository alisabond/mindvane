require('dotenv').config({ path: '../.env' });
const connectDB = require('./db');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const authRoutes = require('./routes/auth');

connectDB();

app.use(express.json());

app.use(express.static('../public')); // return frontend

// Font Awesome:
app.use('/fa', express.static(path.join(__dirname, '..', 'node_modules', '@fortawesome', 'fontawesome-free')));


// //delete test
// app.use((req, res, next) => {
//     console.log('🧾 METHOD:', req.method);
//     console.log('🧾 URL:', req.url);
//     console.log('🧾 HEADERS:', req.headers);
//     console.log('🧾 BODY:', req.body);
//     next();
// });

app.use('/api/auth', authRoutes); // authentication

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
