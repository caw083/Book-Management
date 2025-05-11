const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// const errorHandler = require('./middlewares/errorHandler');

// Load environment variables
dotenv.config({ path: './config.env' });

// Import route files
const authorRoutes = require('./routes/authorRoutes');
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize express app
const app = express();

// CORS middleware
app.use(cors());

// Body parser middleware
app.use(express.json());

// Mount routers
app.use('/api/authors', authorRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Book Management API!</h1><p>Use /api/authors and /api/books to access data.</p>');
});

// Error handler middleware (should be last)
// app.use(errorHandler);

module.exports = app;