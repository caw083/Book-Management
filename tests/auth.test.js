// const request = require('supertest');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const app = require('../server'); // Adjust path as needed to your Express app entry point
// const User = require('../models/user');

// // Load env vars
// dotenv.config({ path: './config/config.env' });

// // Setup test database connection
// beforeAll(async () => {
//   // Use test database connection string if provided, else use memory server
//   const MONGO_TEST_URI = process.env.MONGO_TEST_URI || process.env.MONGO_URI;
  
//   try {
//     await mongoose.connect(MONGO_TEST_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     console.log('Test database connected');
//   } catch (err) {
//     console.error(`Error connecting to test database: ${err.message}`);
//     process.exit(1);
//   }
// });

// afterAll(async () => {
//   await mongoose.disconnect();
//   console.log('Test database connection closed');
// });

// beforeEach(async () => {
//   // Clear users collection before each test
//   await User.deleteMany({});
// });

// describe('Auth Routes', () => {
//   // Test user data
//   const testUser = {
//     name: 'Test User',
//     email: 'test@example.com',
//     password: 'password123'
//   };

//   // Test registration
//   describe('POST /api/auth/register', () => {
//     it('should register a new user and return token', async () => {
//       const res = await request(app)
//         .post('/api/auth/register')
//         .send(testUser);
      
//       expect(res.statusCode).toBe(201);
//       expect(res.body).toHaveProperty('success', true);
//       expect(res.body).toHaveProperty('token');
//       expect(res.headers['set-cookie']).toBeDefined();
//     });

//     it('should return error if email is already registered', async () => {
//       // First create a user
//       await User.create(testUser);
      
//       // Try to register with the same email
//       const res = await request(app)
//         .post('/api/auth/register')
//         .send(testUser);
      
//       expect(res.statusCode).toBe(500); // Assuming your error handler returns 500
//       // This expectation might need adjustment based on your error handling structure
//     });

//     it('should return error if required fields are missing', async () => {
//       const res = await request(app)
//         .post('/api/auth/register')
//         .send({
//           name: 'Missing Fields',
//           // Missing email and password
//         });
      
//       expect(res.statusCode).toBe(500); // Adjust based on your error handling
//     });
//   });

//   // Test login
//   describe('POST /api/auth/login', () => {
//     beforeEach(async () => {
//       // Create a user for login tests
//       await User.create(testUser);
//     });

//     it('should login user and return token', async () => {
//       const res = await request(app)
//         .post('/api/auth/login')
//         .send({
//           email: testUser.email,
//           password: testUser.password
//         });
      
//       expect(res.statusCode).toBe(200);
//       expect(res.body).toHaveProperty('success', true);
//       expect(res.body).toHaveProperty('token');
//       expect(res.headers['set-cookie']).toBeDefined();
//     });

//     it('should return error if email is incorrect', async () => {
//       const res = await request(app)
//         .post('/api/auth/login')
//         .send({
//           email: 'wrong@example.com',
//           password: testUser.password
//         });
      
//       expect(res.statusCode).toBe(500); // Adjust based on your error handling
//     });

//     it('should return error if password is incorrect', async () => {
//       const res = await request(app)
//         .post('/api/auth/login')
//         .send({
//           email: testUser.email,
//           password: 'wrongpassword'
//         });
      
//       expect(res.statusCode).toBe(500); // Adjust based on your error handling
//     });

//     it('should return error if email and password are not provided', async () => {
//       const res = await request(app)
//         .post('/api/auth/login')
//         .send({});
      
//       expect(res.statusCode).toBe(500); // Adjust based on your error handling
//     });
//   });

//   // Test getMe (protected route)
//   describe('GET /api/auth/me', () => {
//     let token;

//     beforeEach(async () => {
//       // Create a user and get token for protected route tests
//       const user = await User.create(testUser);
//       token = user.getSignedJwtToken();
//     });

//     it('should get current user profile when authenticated', async () => {
//       const res = await request(app)
//         .get('/api/auth/me')
//         .set('Authorization', `Bearer ${token}`);
      
//       expect(res.statusCode).toBe(200);
//       expect(res.body).toHaveProperty('success', true);
//       expect(res.body.data).toHaveProperty('name', testUser.name);
//       expect(res.body.data).toHaveProperty('email', testUser.email);
//     });

//     it('should return error if not authenticated', async () => {
//       const res = await request(app)
//         .get('/api/auth/me');
      
//       expect(res.statusCode).toBe(401); // Assuming your auth middleware returns 401 for unauthorized
//     });

//     it('should return error if token is invalid', async () => {
//       const res = await request(app)
//         .get('/api/auth/me')
//         .set('Authorization', 'Bearer invalidtoken');
      
//       expect(res.statusCode).toBe(401); // Assuming your auth middleware returns 401 for unauthorized
//     });
//   });
// });