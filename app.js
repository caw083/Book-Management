const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

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
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handler middleware (should be last)
// app.use(errorHandler);

module.exports = app;