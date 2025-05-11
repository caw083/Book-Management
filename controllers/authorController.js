const Author = require('../models/author');
const Book = require('../models/book');

// @desc    Get books by author
// @route   GET /api/authors/:id/books
// @access  Public
exports.getAuthorBooks = async (req, res) => {
  try {
    // Check if author exists first
    const author = await Author.findById(req.params.id);
    
    if (!author) {
      return res.status(404).json({ 
        success: false, 
        error: 'Author not found with id: ' + req.params.id 
      });
    }
    
    // Find books with this author ID
    const books = await Book.find({ author: req.params.id });
    
    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
      author: {
        id: author._id,
        name: author.name
      }
    });
  } catch (err) {
    // Handle case for invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid author ID format' 
      });
    }
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all authors
// @route   GET /api/authors
// @access  Public
exports.getAuthors = async (req, res) => {
  try {
    // Add optional filtering and sorting capabilities
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `${match}`);
    
    // Finding resource
    query = Author.find(JSON.parse(queryStr));
    
    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Author.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit);
    
    // Execute query
    const authors = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({ 
      success: true, 
      count: authors.length,
      pagination,
      data: authors 
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single author
// @route   GET /api/authors/:id
// @access  Public
exports.getAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    
    if (!author) {
      return res.status(404).json({ 
        success: false, 
        error: 'Author not found with id: ' + req.params.id 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: author 
    });
  } catch (err) {
    // Handle case for invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid author ID format' 
      });
    }
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new author
// @route   POST /api/authors
// @access  Private
exports.createAuthor = async (req, res) => {
    try {
      // Check if an author with the same name already exists
      // Using case-insensitive search for better validation
      const existingAuthor = await Author.findOne({
        name: { $regex: new RegExp(`^${req.body.name}$`, 'i') }
      });
      
      if (existingAuthor) {
        return res.status(400).json({ 
          success: false, 
          error: 'Author with this name already exists' 
        });
      }
      
      const author = await Author.create(req.body);
      res.status(201).json({ success: true, data: author });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  };

// @desc    Update author
// @route   PUT /api/authors/:id
// @access  Private
exports.updateAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!author) {
      return res.status(404).json({ 
        success: false, 
        error: 'Author not found with id: ' + req.params.id 
      });
    }
    
    res.status(200).json({ success: true, data: author });
  } catch (err) {
    // Handle case for invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid author ID format' 
      });
    }
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete author
// @route   DELETE /api/authors/:id
// @access  Private
exports.deleteAuthor = async (req, res) => {
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
      return res.status(404).json({ 
        success: false, 
        error: 'Author not found with id: ' + req.params.id 
      });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    // Handle case for invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid author ID format' 
      });
    }
    res.status(400).json({ success: false, error: err.message });
  }
};