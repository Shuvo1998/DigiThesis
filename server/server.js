// server/server.js
require('dotenv').config(); // .env ফাইল থেকে এনভায়রনমেন্ট ভেরিয়েবল লোড করার জন্য
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors'); // CORS সমস্যা এড়াতে
const path = require('path'); // ফাইল আপলোডের জন্য

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Setup
app.use(cors()); // CORS সক্ষম করুন
app.use(express.json()); // JSON বডি পার্স করার জন্য

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes (আমরা পরে এগুলো তৈরি করব এবং এখানে যোগ করব)
app.use('/api/auth', authRoutes); // Auth routes will be under /api/auth



// Serve static files for uploaded documents (later used for thesis files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic Root Route
app.get('/', (req, res) => {
    res.send('DigiThesis API is running!');
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});