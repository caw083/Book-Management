const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('../app');
const User = require('../models/user');
const http = require('http');
const { generateRandomUser, generateMultipleUsers } = require('../utils/testHelpers');

// Load env vars
dotenv.config({ path: './config/config.env' });

let server;
let testData = { userIds: [] };

beforeAll(async () => {
  // Use test database connection string if provided, else use regular connection
  const MONGO_TEST_URI = process.env.MONGO_TEST_URI || process.env.MONGO_URI;
  
  try {
    await mongoose.connect(MONGO_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (err) {
    console.error(`Error connecting to test database: ${err.message}`);
    process.exit(1);
  }

  // Create a server instance for testing with supertest
  server = http.createServer(app);
  server.listen();
});

afterAll(async () => {
  // Clean up our test users by ID
  if (testData.userIds.length > 0) {
    await User.deleteMany({ _id: { $in: testData.userIds } });
  }
  
  if (server) {
    server.close();
  }
  await mongoose.disconnect();
});

describe('Auth API Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      // Generate a random user for this test
      const randomUser = generateRandomUser();
      
      const res = await request(server)
        .post('/api/auth/register')
        .send(randomUser)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      
      // Store user ID for cleanup
      const decodedToken = JSON.parse(Buffer.from(
        res.body.token.split('.')[1], 'base64'
      ).toString());
      
      if (decodedToken.id) {
        testData.userIds.push(decodedToken.id);
      }
    });

    it('should not register a user with missing required fields', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({
          name: 'Incomplete User'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeDefined();
    });

    it('should not register a user with an existing email', async () => {
      // First register a user
      const duplicateUser = generateRandomUser();
      
      const firstRes = await request(server)
        .post('/api/auth/register')
        .send(duplicateUser);
        
      // Store user ID for cleanup
      if (firstRes.body.token) {
        const decodedToken = JSON.parse(Buffer.from(
          firstRes.body.token.split('.')[1], 'base64'
        ).toString());
        
        if (decodedToken.id) {
          testData.userIds.push(decodedToken.id);
        }
      }

      // Try to register with the same email
      const res = await request(server)
        .post('/api/auth/register')
        .send(duplicateUser)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    let loginTestUser;

    beforeAll(async () => {
      // Create a user for login tests
      loginTestUser = generateRandomUser();
      
      const res = await request(server)
        .post('/api/auth/register')
        .send(loginTestUser);
        
      // Store user ID for cleanup
      if (res.body.token) {
        const decodedToken = JSON.parse(Buffer.from(
          res.body.token.split('.')[1], 'base64'
        ).toString());
        
        if (decodedToken.id) {
          testData.userIds.push(decodedToken.id);
        }
      }
    });

    it('should login with valid credentials', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({
          email: loginTestUser.email,
          password: loginTestUser.password
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('should not login with invalid email', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({
          email: `wrong-${loginTestUser.email}`,
          password: loginTestUser.password
        })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('should not login with invalid password', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({
          email: loginTestUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    let token;
    let profileUser;

    beforeAll(async () => {
      // Create a user for profile tests
      profileUser = generateRandomUser();
      
      const res = await request(server)
        .post('/api/auth/register')
        .send(profileUser);

      token = res.body.token;
      
      // Store user ID for cleanup
      if (token) {
        const decodedToken = JSON.parse(Buffer.from(
          token.split('.')[1], 'base64'
        ).toString());
        
        if (decodedToken.id) {
          testData.userIds.push(decodedToken.id);
        }
      }
    });

    it('should get current user profile', async () => {
      const res = await request(server)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.email).toBe(profileUser.email);
    });

    it('should not access profile without token', async () => {
      const res = await request(server)
        .get('/api/auth/me')
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not authorized to access this route');
    });

    it('should not access profile with invalid token', async () => {
      const res = await request(server)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not authorized to access this route');
    });
  });
});