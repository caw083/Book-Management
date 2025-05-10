const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

// Import database connection
const connectDB = require('./config/db');

// Import route files
const authorRoutes = require('./routes/authorRoutes');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Connect to database
connectDB();

// Body parser middleware
app.use(express.json());

// Mount routers
app.use('/api/authors', authorRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Book Management API!</h1><p>Use /api/authors and /api/books to access data.</p>');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});