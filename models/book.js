const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a book title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  isbn: {
    type: String,
    required: [true, 'Please add an ISBN'],
    unique: true,
    maxlength: [20, 'ISBN cannot be more than 20 characters']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'Author',
    required: true
  },
  publishedDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', BookSchema);