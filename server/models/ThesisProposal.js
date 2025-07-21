// server/models/ThesisProposal.js
const mongoose = require('mongoose');

const thesisProposalSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (student role)
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 10 // Minimum length for a meaningful title
    },
    abstract: {
        type: String,
        required: true,
        minlength: 50 // Minimum length for a decent abstract
    },
    keywords: {
        type: [String], // Array of strings
        default: []
    },
    proposalFilePath: {
        type: String, // Path to the uploaded PDF/DOCX file
        required: true
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to a supervisor (User model with supervisor role)
        default: null // Can be assigned later by admin/supervisor
    },
    status: {
        type: String,
        enum: ['pending_review', 'approved', 'rejected', 'in_progress', 'completed'],
        default: 'pending_review'
    },
    // AI Analysis fields (placeholders for now)
    aiPlagiarismScore: {
        type: Number, // Percentage, e.g., 0-100
        default: 0
    },
    aiGrammarScore: {
        type: Number, // Percentage, e.g., 0-100
        default: 0
    },
    aiFeedback: {
        type: String, // AI-generated feedback
        default: ''
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },
    // Add other fields as needed, e.g., review history, comments
}, { timestamps: true });

const ThesisProposal = mongoose.model('ThesisProposal', thesisProposalSchema);
module.exports = ThesisProposal;