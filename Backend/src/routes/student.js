const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../middleware/auth');
const Book = require('../models/Book');
const BorrowRequest = require('../models/BorrowRequest');
const NewBookRequest = require('../models/NewBookRequest');

// Get student's borrowed books
router.get('/my-books', verifyToken, async (req, res) => {
    try {
        const requests = await BorrowRequest.find({
            userId: req.user._id,
            status: 'approved'
        })
        .populate('bookId')
        .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get student's request history
router.get('/my-requests', verifyToken, async (req, res) => {
    try {
        const requests = await BorrowRequest.find({
            userId: req.user._id
        })
        .populate('bookId')
        .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit a borrow request
router.post('/borrow-request', verifyToken, [
    body('bookId').notEmpty().withMessage('Book ID is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { bookId } = req.body;

        // Check if book exists and is available
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.available <= 0) {
            return res.status(400).json({ message: 'Book is not available for borrowing' });
        }

        // Check if user already has a pending or approved request for this book
        const existingRequest = await BorrowRequest.findOne({
            userId: req.user._id,
            bookId,
            status: { $in: ['pending', 'approved'] }
        });

        if (existingRequest) {
            return res.status(400).json({ 
                message: existingRequest.status === 'pending' 
                    ? 'You already have a pending request for this book' 
                    : 'You have already borrowed this book'
            });
        }

        // Create new borrow request
        const borrowRequest = new BorrowRequest({
            userId: req.user._id,
            bookId,
            status: 'pending'
        });

        await borrowRequest.save();
        res.status(201).json(borrowRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit a new book request
router.post('/new-book-request', verifyToken, [
    body('bookName').trim().notEmpty().withMessage('Book name is required'),
    body('author').trim().notEmpty().withMessage('Author name is required'),
    body('genre').trim().notEmpty().withMessage('Genre is required'),
    body('reason').trim().notEmpty().withMessage('Reason for request is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { bookName, author, genre, reason } = req.body;

        const newBookRequest = new NewBookRequest({
            studentId: req.user._id,
            studentName: req.user.name,
            bookName,
            author,
            genre,
            reason,
            status: 'pending'
        });

        await newBookRequest.save();
        res.status(201).json(newBookRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get student's new book requests
router.get('/new-book-requests', verifyToken, async (req, res) => {
    try {
        const requests = await NewBookRequest.find({
            studentId: req.user._id
        }).sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Search books with filters
router.get('/books/search', verifyToken, async (req, res) => {
    try {
        const { query, category, available, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        let searchQuery = {};

        // Text search if query provided
        if (query) {
            searchQuery.$or = [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { isbn: { $regex: query, $options: 'i' } }
            ];
        }

        // Category filter
        if (category && category !== 'all') {
            searchQuery.category = category;
        }

        // Availability filter
        if (available === 'true') {
            searchQuery.available = { $gt: 0 };
        }

        const [books, total] = await Promise.all([
            Book.find(searchQuery)
                .skip(skip)
                .limit(Number(limit))
                .sort({ createdAt: -1 }),
            Book.countDocuments(searchQuery)
        ]);

        res.json({
            books,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get book details
router.get('/books/:id', verifyToken, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if user has any active requests for this book
        const activeRequest = await BorrowRequest.findOne({
            userId: req.user._id,
            bookId: book._id,
            status: { $in: ['pending', 'approved'] }
        });

        res.json({
            ...book.toObject(),
            userRequest: activeRequest
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 