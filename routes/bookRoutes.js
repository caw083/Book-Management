const express = require('express');
const router = express.Router();

const { 
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook } = require('../controllers/bookController');

// Routes for /api/books
router
  .route('/')
  .get(getBooks)  // Get all books - supports filtering, pagination, and sorting
  .post(createBook);

// Routes for /api/books/:id
router
  .route('/:id')
  .get(getBook)  // Get single book with populated author
  .put(updateBook)
  .delete(deleteBook);

module.exports = router;