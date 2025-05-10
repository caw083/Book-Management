const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().populate('author');
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Create new book
router.post('/', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Delete book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author');
    
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }
    
    res.status(200).json({ success: true, data: book });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Update book
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author');
    
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }
    
    res.status(200).json({ success: true, data: book });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;