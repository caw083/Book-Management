const express = require('express');
const router = express.Router();
const {
  getAuthors,
  getAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthorBooks
} = require('../controllers/authorController');

// Routes for /api/authors
router
  .route('/')
  .get(getAuthors)  // Get all authors - supports filtering, pagination, and sorting
  .post(createAuthor);

// Routes for /api/authors/:id
router
  .route('/:id')
  .get(getAuthor)  // Get single author
  .put(updateAuthor)
  .delete(deleteAuthor);

// Get books by author
router.route('/:id/books').get(getAuthorBooks);

module.exports = router;