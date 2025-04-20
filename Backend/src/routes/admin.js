const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const BookRequest = require('../models/BookRequest');
const Book = require('../models/Book');
const User = require('../models/User');

// Middleware to verify admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Get all pending book requests
router.get('/requests', isAdmin, async (req, res) => {
  try {
    const requests = await BookRequest.find({ status: 'pending' })
      .populate('student', 'name email')
      .populate('book', 'title author isbn');
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all approved book requests
router.get('/approved-requests', isAdmin, async (req, res) => {
  try {
    const requests = await BookRequest.find({ status: 'approved' })
      .populate('student', 'name email')
      .populate('book', 'title author isbn');
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve a book request
router.post('/requests/:id/approve', isAdmin, [
  body('dueDate').isISO8601().withMessage('Invalid due date format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { dueDate, adminNotes } = req.body;

    const request = await BookRequest.findById(req.params.id)
      .populate('book');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    // Check if book is still available
    const book = await Book.findById(request.book._id);
    if (book.available <= 0) {
      return res.status(400).json({ message: 'Book is no longer available' });
    }

    // Update request status
    request.status = 'approved';
    request.approvalDate = new Date();
    request.dueDate = new Date(dueDate);
    request.adminNotes = adminNotes;

    // Update book availability
    book.available -= 1;
    await book.save();

    await request.save();
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject a book request
router.post('/requests/:id/reject', isAdmin, [
  body('adminNotes').trim().notEmpty().withMessage('Please provide a reason for rejection')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { adminNotes } = req.body;

    const request = await BookRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    request.status = 'rejected';
    request.adminNotes = adminNotes;
    await request.save();

    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get system statistics
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalRequests = await BookRequest.countDocuments();
    const pendingRequests = await BookRequest.countDocuments({ status: 'pending' });
    const approvedRequests = await BookRequest.countDocuments({ status: 'approved' });

    res.json({
      totalBooks,
      totalUsers,
      totalRequests,
      pendingRequests,
      approvedRequests
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 