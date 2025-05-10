const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an author name'],
    trim: true,
    maxlength: [50, 'Author name cannot be more than 50 characters']
  },
  biography: {
    type: String,
    maxlength: [500, 'Biography cannot be more than 500 characters']
  },
  nationality: {
    type: String,
    maxlength: [50, 'Nationality cannot be more than 50 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Author', AuthorSchema);