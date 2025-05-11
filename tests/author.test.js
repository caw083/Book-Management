const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const Author = require('../models/author');
const Book = require('../models/book');
const authorController = require('../controllers/authorController');

// Create a mock Express app for testing
const app = express();
app.use(express.json());

// Set up routes for testing
app.get('/api/authors', authorController.getAuthors);
app.get('/api/authors/:id', authorController.getAuthor);
app.post('/api/authors', authorController.createAuthor);
app.put('/api/authors/:id', authorController.updateAuthor);
app.delete('/api/authors/:id', authorController.deleteAuthor);
app.get('/api/authors/:id/books', authorController.getAuthorBooks);

// Mock data
const mockAuthor = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Test Author',
  biography: 'Test Biography',
  nationality: 'Test Nationality',
  createdAt: new Date()
};

const mockBooks = [
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Test Book 1',
    author: mockAuthor._id
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Test Book 2',
    author: mockAuthor._id
  }
];

// Mock the Author and Book models
jest.mock('../models/author');
jest.mock('../models/book');

describe('Author Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/authors', () => {
    it('should get all authors', async () => {
      const mockAuthors = [mockAuthor];
      Author.find.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockAuthors)
      }));
      
      Author.countDocuments.mockResolvedValue(1);

      const res = await request(app).get('/api/authors');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data).toEqual(mockAuthors);
    });

    it('should handle errors for get all authors', async () => {
      Author.find.mockImplementation(() => {
        throw new Error('Test error');
      });

      const res = await request(app).get('/api/authors');
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Test error');
    });

    it('should handle pagination', async () => {
      const mockAuthors = [mockAuthor];
      Author.find.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockAuthors)
      }));
      
      Author.countDocuments.mockResolvedValue(20);

      const res = await request(app).get('/api/authors?page=2&limit=10');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.pagination).toHaveProperty('prev');
      expect(res.body.pagination.prev).toEqual({ page: 1, limit: 10 });
    });
  });

  describe('GET /api/authors/:id', () => {
    it('should get single author', async () => {
      Author.findById.mockResolvedValue(mockAuthor);

      const res = await request(app).get(`/api/authors/${mockAuthor._id}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockAuthor);
    });

    it('should return 404 if author not found', async () => {
      Author.findById.mockResolvedValue(null);

      const res = await request(app).get(`/api/authors/${mockAuthor._id}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Author not found');
    });

    it('should handle CastError for invalid ID format', async () => {
      const castError = new Error('Invalid ID');
      castError.name = 'CastError';
      Author.findById.mockRejectedValue(castError);

      const res = await request(app).get('/api/authors/invalidid');
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid author ID format');
    });
  });

  describe('POST /api/authors', () => {
    it('should create a new author', async () => {
      Author.findOne.mockResolvedValue(null);
      Author.create.mockResolvedValue(mockAuthor);

      const res = await request(app)
        .post('/api/authors')
        .send({
          name: 'Test Author',
          biography: 'Test Biography',
          nationality: 'Test Nationality'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockAuthor);
    });

    it('should not create author with duplicate name', async () => {
      Author.findOne.mockResolvedValue(mockAuthor);

      const res = await request(app)
        .post('/api/authors')
        .send({
          name: 'Test Author',
          biography: 'Test Biography'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Author with this name already exists');
    });

    it('should handle validation errors', async () => {
      const validationError = new Error('Validation failed');
      Author.findOne.mockResolvedValue(null);
      Author.create.mockRejectedValue(validationError);

      const res = await request(app)
        .post('/api/authors')
        .send({
          // Missing required name field
          biography: 'Test Biography'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/authors/:id', () => {
    it('should update author', async () => {
      const updatedAuthor = { ...mockAuthor, name: 'Updated Name' };
      Author.findByIdAndUpdate.mockResolvedValue(updatedAuthor);

      const res = await request(app)
        .put(`/api/authors/${mockAuthor._id}`)
        .send({ name: 'Updated Name' });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(updatedAuthor);
    });

    it('should return 404 if author not found for update', async () => {
      Author.findByIdAndUpdate.mockResolvedValue(null);

      const res = await request(app)
        .put(`/api/authors/${mockAuthor._id}`)
        .send({ name: 'Updated Name' });
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Author not found');
    });

    it('should handle CastError for invalid ID format in update', async () => {
      const castError = new Error('Invalid ID');
      castError.name = 'CastError';
      Author.findByIdAndUpdate.mockRejectedValue(castError);

      const res = await request(app)
        .put('/api/authors/invalidid')
        .send({ name: 'Updated Name' });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid author ID format');
    });
  });

  describe('DELETE /api/authors/:id', () => {
    it('should delete author if no associated books', async () => {
      Book.find.mockResolvedValue([]);
      Author.findByIdAndDelete.mockResolvedValue(mockAuthor);

      const res = await request(app).delete(`/api/authors/${mockAuthor._id}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should not delete author with associated books', async () => {
      Book.find.mockResolvedValue(mockBooks);

      const res = await request(app).delete(`/api/authors/${mockAuthor._id}`);
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Cannot delete author with associated books');
    });

    it('should return 404 if author not found for deletion', async () => {
      Book.find.mockResolvedValue([]);
      Author.findByIdAndDelete.mockResolvedValue(null);

      const res = await request(app).delete(`/api/authors/${mockAuthor._id}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Author not found');
    });
  });

  describe('GET /api/authors/:id/books', () => {
    it('should get books by author', async () => {
      Author.findById.mockResolvedValue(mockAuthor);
      Book.find.mockResolvedValue(mockBooks);

      const res = await request(app).get(`/api/authors/${mockAuthor._id}/books`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.data).toEqual(mockBooks);
      expect(res.body.author).toEqual({
        id: mockAuthor._id,
        name: mockAuthor.name
      });
    });

    it('should return 404 if author not found for books', async () => {
      Author.findById.mockResolvedValue(null);

      const res = await request(app).get(`/api/authors/${mockAuthor._id}/books`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Author not found');
    });
  });
});