const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

// Import database connection
const connectDB = require('./config/db');

// Import app
const app = require('./app');

// Set port
const port = process.env.PORT || 3000;

// Connect to database
connectDB();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});

// Handle unhandled exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});