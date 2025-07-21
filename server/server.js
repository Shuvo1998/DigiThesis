// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Setup
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const thesisRoutes = require('./routes/thesisRoutes'); // <--- NOW THIS IMPORT WILL WORK

app.use('/api/auth', authRoutes);
app.use('/api/theses', thesisRoutes); // <--- NOW THIS app.use WILL WORK


// Serve static files for uploaded documents
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic Root Route
app.get('/', (req, res) => {
    res.send('DigiThesis API is running!');
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});