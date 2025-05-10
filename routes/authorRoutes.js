const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');

// Get all authors
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json({ success: true, count: authors.length, data: authors });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Create new author
router.post('/', async (req, res) => {
  try {
    const author = await Author.create(req.body);
    res.status(201).json({ success: true, data: author });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Delete author
router.delete('/:id', async (req, res) => {
  try {
    // First check if there are any books associated with this author
    const books = await Book.find({ author: req.params.id });
    
    if (books.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete author with associated books. Delete the books first.' 
      });
    }
    
    const author = await Author.findByIdAndDelete(req.params.id);
    
    if (!author) {
      return res.status(404).json({ success: false, error: 'Author not found' });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get single author
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    
    if (!author) {
      return res.status(404).json({ success: false, error: 'Author not found' });
    }
    
    res.status(200).json({ success: true, data: author });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Update author
router.put('/:id', async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!author) {
      return res.status(404).json({ success: false, error: 'Author not found' });
    }
    
    res.status(200).json({ success: true, data: author });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;