const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

// Import database connection
const connectDB = require('./config/db');

// Import models
const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

// Body parser middleware
app.use(express.json());

// Connect to database
connectDB();

// Basic route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Book Management API!</h1><p>Use /api/authors and /api/books to access data.</p>');
});

// Author routes
app.get('/api/authors', async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json({ success: true, count: authors.length, data: authors });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/authors', async (req, res) => {
  try {
    const author = await Author.create(req.body);
    res.status(201).json({ success: true, data: author });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Book routes
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find().populate('author');
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/books', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// User routes
app.post('/api/users/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    
    // Create token
    const token = user.getSignedJwtToken();
    
    res.status(201).json({ success: true, token });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide email and password' });
  }
  
  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Create token
    const token = user.getSignedJwtToken();
    
    res.status(200).json({ success: true, token });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/authors/:id', async (req, res) => {
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



// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});