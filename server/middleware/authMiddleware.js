// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// প্রোটেক্ট মিডলওয়্যার: JWT টোকেন ভেরিফাই করে ইউজারকে অথেন্টিকেট করে
const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // 'Bearer TOKEN' থেকে শুধু টোকেন অংশ নিন
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // টোকেন ভেরিফাই করুন

            req.user = decoded.user; // ডিকোড করা ইউজার ইনফো req.user এ সেট করুন
            next(); // পরবর্তী মিডলওয়্যার বা রাউট হ্যান্ডলারে যান

        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401).json({ msg: 'Not authorized, token failed or expired' });
        }
    }

    if (!token) {
        res.status(401).json({ msg: 'Not authorized, no token found' });
    }
};

// অথরাইজ মিডলওয়্যার: ইউজার রোল অনুযায়ী অ্যাক্সেস নিয়ন্ত্রণ করে
const authorize = (roles = []) => (req, res, next) => {
    // যদি roles অ্যারে খালি হয়, তাহলে যেকোনো অথেন্টিকেটেড ইউজার অ্যাক্সেস করতে পারবে
    // অথবা যদি ইউজারের রোল প্রদত্ত roles অ্যারেতে থাকে
    if (!req.user || (roles.length > 0 && !roles.includes(req.user.role))) {
        return res.status(403).json({ msg: `Access denied. Your role (${req.user.role}) is not authorized.` });
    }
    next();
};

module.exports = { protect, authorize };