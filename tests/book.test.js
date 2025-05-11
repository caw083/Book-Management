const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Book = require('../models/book');
const Author = require('../models/author');
const User = require('../models/user');

let mongoServer;
let token;
let authorId;
let bookId;

// Setup test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

const testAuthor = {
  name: 'J.K. Rowling',
  bio: 'British author best known for the Harry Potter series'
};

const testBook = {
  title: 'Harry Potter and the Philosopher\'s Stone',
  description: 'First book in the Harry Potter series',
  isbn: '9780747532743',
  publishedDate: '1997-06-26'
};

// Setup and teardown
beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);

  // Register a test user and get the token
  const registerResponse = await request(app)
    .post('/api/auth/register')
    .send(testUser);

  // Login to get JWT token
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: testUser.email,
      password: testUser.password
    });

  token = loginResponse.body.token;

  // Create a test author
  const authorResponse = await request(app)
    .post('/api/authors')
    .set('Authorization', `Bearer ${token}`)
    .send(testAuthor);

  authorId = authorResponse.body.data._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear test data between tests
afterEach(async () => {
  await Book.deleteMany({});
});

describe('Book API Tests', () => {
  describe('GET /api/books', () => {
    it('should get all books with pagination', async () => {
      // Create multiple books for pagination testing
      for (let i = 0; i < 15; i++) {
        await request(app)
          .post('/api/books')
          .set('Authorization', `Bearer ${token}`)
          .send({
            ...testBook,
            title: `Test Book ${i}`,
            isbn: `978074753274${i}`,
            author: authorId
          });
      }

      const res = await request(app)
        .get('/api/books?page=1&limit=10')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(10);
      expect(res.body.data.length).toBe(10);
      expect(res.body.pagination.next).toBeDefined();
      expect(res.body.pagination.next.page).toBe(2);
    });

    it('should filter books by query parameters', async () => {
      // Create a book
      await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...testBook,
          author: authorId
        });

      const res = await request(app)
        .get(`/api/books?title=${encodeURIComponent(testBook.title)}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].title).toBe(testBook.title);
    });

    it('should sort books by specified field', async () => {
      // Create two books with different titles
      await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...testBook,
          title: 'B Title',
          isbn: '9780747532744',
          author: authorId
        });

      await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...testBook,
          title: 'A Title',
          isbn: '9780747532745',
          author: authorId
        });

      const res = await request(app)
        .get('/api/books?sort=title')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data[0].title).toBe('A Title');
      expect(res.body.data[1].title).toBe('B Title');
    });
  });

  describe('GET /api/books/:id', () => {
    it('should get single book by ID', async () => {
      // Create a book
      const bookRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...testBook,
          author: authorId
        });

      bookId = bookRes.body.data._id;

      const res = await request(app)
        .get(`/api/books/${bookId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(testBook.title);
      expect(res.body.data.isbn).toBe(testBook.isbn);
      expect(res.body.data.author).toBeDefined();
      expect(res.body.data.author.name).toBe(testAuthor.name);
    });

    it('should return 404 for non-existent book ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .get(`/api/books/${nonExistentId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeDefined();
    });

    it('should return 400 for invalid book ID format', async () => {
      const res = await request(app)
        .get('/api/books/invalidid')
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid book ID format');
    });
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...testBook,
          author: authorId
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(testBook.title);
      expect(res.body.data.isbn).toBe(testBook.isbn);
      expect(res.body.data.author.toString()).toBe(authorId);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Missing required fields',
          author: authorId
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeDefined();
    });

    it('should not allow creating book without authentication', async () => {
      const res = await request(app)
        .post('/api/books')
        .send({
          ...testBook,
          author: authorId
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/books/:id', () => {
    it('should update an existing book', async () => {
      // Create a book first
      const bookRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...testBook,
          author: authorId
        });

      bookId = bookRes.body.data._id;
      
      const updatedTitle = 'Updated Book Title';
      
      const res = await request(app)
        .put(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: updatedTitle
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(updatedTitle);
      expect(res.body.data.isbn).toBe(testBook.isbn); // Should remain unchanged
    });

    it('should return 404 for non-existent book ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .put(`/api/books/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title'
        })
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Book not found');
    });

    it('should not allow updating book without authentication', async () => {
      // Create a book first
      const bookRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...testBook,
          author: authorId
        });

      bookId = bookRes.body.data._id;
      
      const res = await request(app)
        .put(`/api/books/${bookId}`)
        .send({
          title: 'Updated Title'
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('should delete an existing book', async () => {
      // Create a book first
      const bookRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...testBook,
          author: authorId
        });

      bookId = bookRes.body.data._id;
      
      const res = await request(app)
        .delete(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      
      // Verify the book was deleted
      const getRes = await request(app)
        .get(`/api/books/${bookId}`)
        .expect(404);
    });

    it('should return 404 for non-existent book ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .delete(`/api/books/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Book not found');
    });

    it('should not allow deleting book without authentication', async () => {
      // Create a book first
      const bookRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...testBook,
          author: authorId
        });

      bookId = bookRes.body.data._id;
      
      const res = await request(app)
        .delete(`/api/books/${bookId}`)
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });
});