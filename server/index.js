const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

app.use(express.json());
app.use(express.static('../public')); // return frontend

// Font Awesome:
app.use('/fa', express.static(path.join(__dirname, '..', 'node_modules', '@fortawesome', 'fontawesome-free')));


app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
