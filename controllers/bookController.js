const Book = require('../models/book');
const Author = require('../models/author');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Create pagination object
    const pagination = {};
    
    // Get total count of books
    const total = await Book.countDocuments();
    
    // Add next page if applicable
    if (startIndex + limit < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    // Add previous page if applicable
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    // Get books with pagination
    const books = await Book.find()
      .populate('author', 'name biography nationality')
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: books.length,
      pagination,
      data: books
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found with the provided ID'
      });
    }
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (err) {
    // Handle CastError for invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid book ID format'
      });
    }
    
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private
exports.createBook = async (req, res) => {
  try {
    // First check if the author exists
    const author = await Author.findById(req.body.author);
    if (!author) {
      return res.status(404).json({
        success: false,
        error: 'Author not found with the provided ID'
      });
    }
    
    // Then check for duplicate ISBN
    const existingBook = await Book.findOne({ isbn: req.body.isbn });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        error: 'Book with this ISBN already exists'
      });
    }
    
    // Create the book if all validations pass
    const book = await Book.create(req.body);
    
    res.status(201).json({
      success: true,
      data: book
    });
  } catch (err) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed: ' + err.message
      });
    }
    
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private
exports.updateBook = async (req, res) => {
  try {
    // First check if book exists
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found with the provided ID'
      });
    }
    
    // If author is being updated, check if new author exists
    if (req.body.author) {
      const author = await Author.findById(req.body.author);
      if (!author) {
        return res.status(404).json({
          success: false,
          error: 'Author not found with the provided ID'
        });
      }
    }
    
    // If ISBN is being updated, check for duplicates
    if (req.body.isbn && req.body.isbn !== book.isbn) {
      const existingBook = await Book.findOne({ isbn: req.body.isbn });
      if (existingBook && existingBook._id.toString() !== req.params.id) {
        return res.status(400).json({
          success: false,
          error: 'Book with this ISBN already exists'
        });
      }
    }
    
    // Update the book if all validations pass
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author');
    
    res.status(200).json({
      success: true,
      data: updatedBook
    });
  } catch (err) {
    // Handle CastError for invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid book ID format'
      });
    }
    
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found with the provided ID'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID'
      });
    }
    
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};