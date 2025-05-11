// const request = require('supertest');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const app = require('../app');
// const User = require('../models/user');
// const http = require('http');

// // Load env vars
// dotenv.config({ path: './config/config.env' });

// let server;

// // Test user data
// const testUser = {
//   name: 'Auth Test User',
//   email: 'authtest@example.com',
//   password: 'password123'
// };

// // Setup and teardown
// beforeAll(async () => {
//   // Use test database connection string if provided, else use regular connection
//   const MONGO_TEST_URI = process.env.MONGO_TEST_URI || process.env.MONGO_URI;
  
//   try {
//     await mongoose.connect(MONGO_TEST_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//   } catch (err) {
//     console.error(`Error connecting to test database: ${err.message}`);
//     process.exit(1);
//   }

//   // Create a server instance for testing with supertest
//   server = http.createServer(app);
//   server.listen();

//   // Clear all users before tests
//   await User.deleteMany({});
// });

// afterAll(async () => {
//   if (server) {
//     server.close();
//   }
//   await mongoose.disconnect();
// });

// describe('Auth API Tests', () => {
//   describe('POST /api/auth/register', () => {
//     it('should register a new user', async () => {
//       const res = await request(server)
//         .post('/api/auth/register')
//         .send(testUser)
//         .expect(201);

//       expect(res.body.success).toBe(true);
//       expect(res.body.token).toBeDefined();
//       expect(res.body.user).toBeDefined();
//       expect(res.body.user.name).toBe(testUser.name);
//       expect(res.body.user.email).toBe(testUser.email);
//       expect(res.body.user.password).toBeUndefined(); // Password should not be returned
//     });

//     it('should not register a user with missing required fields', async () => {
//       const res = await request(server)
//         .post('/api/auth/register')
//         .send({
//           name: 'Incomplete User'
//         })
//         .expect(400);

//       expect(res.body.success).toBe(false);
//       expect(res.body.error).toBeDefined();
//     });

//     it('should not register a user with an existing email', async () => {
//       // Try to register with the same email
//       const res = await request(server)
//         .post('/api/auth/register')
//         .send(testUser)
//         .expect(400);

//       expect(res.body.success).toBe(false);
//       expect(res.body.error).toBe('User already exists');
//     });
//   });

//   describe('POST /api/auth/login', () => {
//     it('should login with valid credentials', async () => {
//       const res = await request(server)
//         .post('/api/auth/login')
//         .send({
//           email: testUser.email,
//           password: testUser.password
//         })
//         .expect(200);

//       expect(res.body.success).toBe(true);
//       expect(res.body.token).toBeDefined();
//       expect(res.body.user).toBeDefined();
//       expect(res.body.user.name).toBe(testUser.name);
//     });

//     it('should not login with invalid email', async () => {
//       const res = await request(server)
//         .post('/api/auth/login')
//         .send({
//           email: 'nonexistent@example.com',
//           password: testUser.password
//         })
//         .expect(401);

//       expect(res.body.success).toBe(false);
//       expect(res.body.error).toBe('Invalid credentials');
//     });

//     it('should not login with invalid password', async () => {
//       const res = await request(server)
//         .post('/api/auth/login')
//         .send({
//           email: testUser.email,
//           password: 'wrongpassword'
//         })
//         .expect(401);

//       expect(res.body.success).toBe(false);
//       expect(res.body.error).toBe('Invalid credentials');
//     });
//   });

//   describe('GET /api/auth/me', () => {
//     let token;

//     beforeAll(async () => {
//       // Login to get token
//       const res = await request(server)
//         .post('/api/auth/login')
//         .send({
//           email: testUser.email,
//           password: testUser.password
//         });

//       token = res.body.token;
//     });

//     it('should get current user profile', async () => {
//       const res = await request(server)
//         .get('/api/auth/me')
//         .set('Authorization', `Bearer ${token}`)
//         .expect(200);

//       expect(res.body.success).toBe(true);
//       expect(res.body.data).toBeDefined();
//       expect(res.body.data.name).toBe(testUser.name);
//       expect(res.body.data.email).toBe(testUser.email);
//     });

//     it('should not access profile without token', async () => {
//       const res = await request(server)
//         .get('/api/auth/me')
//         .expect(401);

//       expect(res.body.success).toBe(false);
//       expect(res.body.error).toBe('Not authorized to access this route');
//     });

//     it('should not access profile with invalid token', async () => {
//       const res = await request(server)
//         .get('/api/auth/me')
//         .set('Authorization', 'Bearer invalidtoken')
//         .expect(401);

//       expect(res.body.success).toBe(false);
//       expect(res.body.error).toBe('Not authorized to access this route');
//     });
//   });
// });