// server/routes/thesisRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ThesisProposal = require('../models/ThesisProposal'); // Make sure this path is correct
const { protect, authorize } = require('../middleware/authMiddleware'); // Ensure authMiddleware is correctly imported
const fs = require('fs'); // Import file system module for deleting files

// Configure Multer for file storage
// Ensure 'uploads' directory exists in your server root (DigiThesis/server/uploads)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        // Create 'uploads' directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) { // Use fs.existsSync
            fs.mkdirSync(uploadDir); // Use fs.mkdirSync
        }
        cb(null, uploadDir); // Files will be stored in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        // Use originalname with a timestamp to prevent overwriting and ensure uniqueness
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File filter to accept only PDF, DOCX, and DOC
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/msword' // .doc
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        // Pass an error to Multer
        const error = new Error('Only PDF, DOCX, and DOC files are allowed!');
        error.code = 'INVALID_MIME_TYPE'; // Custom error code
        cb(error, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10MB file size limit
    },
    fileFilter: fileFilter
}).single('proposalFile'); // Apply single file upload for 'proposalFile' field

// --- Helper for Multer error handling in routes ---
const handleMulterError = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(400).json({ msg: err.message });
        } else if (err) {
            // An unknown error occurred when uploading.
            if (err.code === 'INVALID_MIME_TYPE') {
                return res.status(400).json({ msg: err.message });
            }
            return res.status(500).json({ msg: err.message || 'An unknown error occurred during file upload.' });
        }
        next(); // Everything went fine, proceed to the next middleware/route handler
    });
};

// @route   POST /api/theses/proposals
// @desc    Submit a new thesis proposal with file upload
// @access  Private (Student only)
router.post('/proposals', protect, authorize(['student']), handleMulterError, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded or invalid file type.' });
        }

        const { title, abstract, keywords } = req.body;

        // Basic validation for text fields (can be more robust with express-validator)
        if (!title || !abstract || !keywords) {
            // If text fields are missing, delete the uploaded file to avoid orphaned files
            fs.unlinkSync(req.file.path); // Use fs.unlinkSync to delete the file
            return res.status(400).json({ msg: 'Please enter all required fields: Title, Abstract, Keywords.' });
        }

        // Parse keywords from JSON string to array
        let parsedKeywords;
        try {
            parsedKeywords = JSON.parse(keywords);
            if (!Array.isArray(parsedKeywords)) {
                throw new Error('Keywords must be a JSON array string.');
            }
        } catch (parseError) {
            fs.unlinkSync(req.file.path); // Use fs.unlinkSync
            return res.status(400).json({ msg: 'Invalid keywords format. Must be a comma-separated list converted to JSON array string.' });
        }

        const newProposal = new ThesisProposal({
            student: req.user.id, // Comes from protect middleware
            title,
            abstract,
            keywords: parsedKeywords,
            proposalFilePath: req.file.path // Store the full path of the uploaded file
        });

        const savedProposal = await newProposal.save();

        // --- AI Integration Placeholder ---
        console.log(`Sending proposal abstract to AI for plagiarism/grammar check... (Mock Call)`);
        // ----------------------------------

        res.status(201).json({
            msg: 'Thesis proposal submitted successfully!',
            proposal: savedProposal,
            // Provide a URL path that the frontend can use to access the file
            filePath: `/uploads/${path.basename(req.file.path)}` // Use path.basename
        });

    } catch (err) {
        console.error(err.message);
        // Generic error response, specific Multer errors handled by handleMulterError
        res.status(500).send('Server Error during proposal submission.');
    }
});


// @route   GET /api/theses/proposals (Admin only - get all proposals)
// @desc    Get all thesis proposals in the system
// @access  Private (Admin only)
router.get('/proposals', protect, authorize(['admin']), async (req, res) => {
    try {
        const proposals = await ThesisProposal.find()
            .populate('student', 'username email')
            .populate('supervisor', 'username email')
            .sort({ submissionDate: -1 }); // Latest first
        res.json(proposals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error fetching all proposals.');
    }
});


// @route   GET /api/theses/proposals/student/:studentId
// @desc    Get all thesis proposals for a specific student
// @access  Private (Student can only view their own; Supervisor/Admin can view any student's)
router.get('/proposals/student/:studentId', protect, authorize(['student', 'supervisor', 'admin']), async (req, res) => {
    try {
        const studentId = req.params.studentId;

        // Security check: Student can only view their own proposals
        // Supervisors/Admins can view anyone's
        if (req.user.role === 'student' && req.user.id !== studentId) {
            return res.status(403).json({ msg: 'Not authorized to view other students\' proposals.' });
        }

        const proposals = await ThesisProposal.find({ student: studentId })
            .populate('student', 'username email') // Populate student info
            .populate('supervisor', 'username email'); // Populate supervisor info
        res.json(proposals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error fetching proposals.');
    }
});


// @route   GET /api/theses/proposals/pending-supervisor
// @desc    Get all pending proposals for a supervisor
// @access  Private (Supervisor only)
router.get('/proposals/pending-supervisor', protect, authorize(['supervisor']), async (req, res) => {
    try {
        // Ensure the supervisor field matches the logged-in supervisor's ID OR is null/undefined if admin assigns later
        const proposals = await ThesisProposal.find({
            supervisor: req.user.id, // Proposals assigned to this supervisor
            status: 'pending_review'
        }).populate('student', 'username email').populate('supervisor', 'username email');
        res.json(proposals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error fetching supervisor pending proposals.');
    }
});


// @route   GET /api/theses/proposals/:id
// @desc    Get a single thesis proposal by ID
// @access  Private (Student, Supervisor, Admin)
router.get('/proposals/:id', protect, authorize(['student', 'supervisor', 'admin']), async (req, res) => {
    try {
        const proposal = await ThesisProposal.findById(req.params.id)
            .populate('student', 'username email')
            .populate('supervisor', 'username email');

        if (!proposal) {
            return res.status(404).json({ msg: 'Thesis proposal not found' });
        }

        // Authorization check: student can only view their own proposal
        if (req.user.role === 'student' && proposal.student && proposal.student._id.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to view this proposal.' });
        }

        res.json(proposal);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Thesis proposal not found (Invalid ID)' });
        }
        res.status(500).send('Server Error fetching proposal.');
    }
});


// @route   PUT /api/theses/proposals/:id/status
// @desc    Update status of a thesis proposal
// @access  Private (Supervisor, Admin)
router.put('/proposals/:id/status', protect, authorize(['supervisor', 'admin']), async (req, res) => {
    try {
        const { status } = req.body;
        const proposalId = req.params.id;

        const proposal = await ThesisProposal.findById(proposalId);
        if (!proposal) {
            return res.status(404).json({ msg: 'Thesis proposal not found' });
        }

        // Supervisor can only update status for proposals assigned to them
        if (req.user.role === 'supervisor' && proposal.supervisor && proposal.supervisor.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to update status for this proposal.' });
        }

        // Validate status transition if needed (e.g., cannot go from rejected to approved directly)
        const validStatuses = ['pending_review', 'approved', 'rejected', 'in_progress', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ msg: 'Invalid status provided.' });
        }

        proposal.status = status;
        await proposal.save();

        res.json({ msg: `Proposal status updated to ${status}`, proposal });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error updating proposal status.');
    }
});


// @route   PUT /api/theses/proposals/:id/assign-supervisor
// @desc    Assign a supervisor to a thesis proposal
// @access  Private (Admin only)
router.put('/proposals/:id/assign-supervisor', protect, authorize(['admin']), async (req, res) => {
    try {
        const { supervisorId } = req.body;
        const proposalId = req.params.id;

        const proposal = await ThesisProposal.findById(proposalId);
        if (!proposal) {
            return res.status(404).json({ msg: 'Thesis proposal not found' });
        }

        // Optionally, check if supervisorId exists and is actually a supervisor
        // const supervisorUser = await User.findById(supervisorId);
        // if (!supervisorUser || supervisorUser.role !== 'supervisor') {
        //     return res.status(400).json({ msg: 'Invalid supervisor ID or user is not a supervisor.' });
        // }

        proposal.supervisor = supervisorId;
        // Optionally update status to 'in_progress' or similar after assignment
        // proposal.status = 'in_progress';
        await proposal.save();

        res.json({ msg: 'Supervisor assigned successfully', proposal });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error assigning supervisor.');
    }
});

// @route   DELETE /api/theses/proposals/:id
// @desc    Delete a thesis proposal (e.g., by Admin or student if not reviewed)
// @access  Private (Admin, or Student if conditions met)
router.delete('/proposals/:id', protect, authorize(['admin', 'student']), async (req, res) => {
    try {
        const proposalId = req.params.id;
        const proposal = await ThesisProposal.findById(proposalId);

        if (!proposal) {
            return res.status(404).json({ msg: 'Thesis proposal not found' });
        }

        // Allow student to delete only their own proposal and only if it's pending review
        if (req.user.role === 'student' && proposal.student.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to delete this proposal.' });
        }
        if (req.user.role === 'student' && proposal.status !== 'pending_review') {
            return res.status(403).json({ msg: 'Cannot delete proposal once it has been reviewed.' });
        }

        // If there's an associated file, delete it from the file system
        if (proposal.proposalFilePath && fs.existsSync(proposal.proposalFilePath)) {
            fs.unlinkSync(proposal.proposalFilePath);
        }

        await ThesisProposal.deleteOne({ _id: proposalId }); // Use deleteOne or findByIdAndDelete

        res.json({ msg: 'Thesis proposal and associated file deleted successfully' });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Thesis proposal not found (Invalid ID)' });
        }
        res.status(500).send('Server Error deleting proposal.');
    }
});


module.exports = router;