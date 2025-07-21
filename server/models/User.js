// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address'] // Email validation
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Minimum password length
    },
    role: {
        type: String,
        enum: ['student', 'supervisor', 'admin'],
        default: 'student'
    },
    // পরে আমরা প্রোফাইল ছবি, ডিপার্টমেন্ট ইত্যাদি যোগ করতে পারি
}, { timestamps: true }); // createdAt এবং updatedAt ফিল্ড স্বয়ংক্রিয়ভাবে যোগ হবে

// পাসওয়ার্ড সেভ করার আগে হ্যাশ করুন
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { // যদি পাসওয়ার্ড মডিফাই না হয়, তাহলে হ্যাশ করার দরকার নেই
        return next();
    }
    const salt = await bcrypt.genSalt(10); // একটি সল্ট তৈরি করুন
    this.password = await bcrypt.hash(this.password, salt); // পাসওয়ার্ড হ্যাশ করুন
    next();
});

// পাসওয়ার্ড তুলনা করার জন্য মেথড
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;