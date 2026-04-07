const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

// Use a test DB or mock mongoose
let app;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key';
  // Connect to test database
  await mongoose.connect(process.env.MONGODB_URI);
  app = require('../server');
});

afterAll(async () => {
  // Clean up test users created during tests
  await mongoose.connection.collection('users').deleteMany({ email: /testuser.*@nutrismart\.test/ });
  await mongoose.disconnect();
});

describe('POST /api/auth/register', () => {
  const testUser = {
    name: 'Test User',
    email: `testuser_${Date.now()}@nutrismart.test`,
    password: 'password123',
    age: 25,
    weight: 70,
    height: 175,
    diet: 'veg',
    goal: 'maintain',
  };

  it('registers a new user and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe(testUser.email);
  });

  it('rejects duplicate email registration', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('rejects registration with missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'x@x.com' });
    expect(res.statusCode).toBe(400);
  });

  it('rejects invalid email format', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...testUser, email: 'not-an-email' });
    expect(res.statusCode).toBe(400);
  });

  it('rejects password shorter than 6 characters', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...testUser, password: '123' });
    expect(res.statusCode).toBe(400);
  });

  it('rejects invalid diet value', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...testUser, diet: 'keto' });
    expect(res.statusCode).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  const loginUser = {
    name: 'Login Test',
    email: `logintest_${Date.now()}@nutrismart.test`,
    password: 'securepass',
    age: 30, weight: 75, height: 180, diet: 'non-veg', goal: 'gain',
  };

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send(loginUser);
  });

  it('logs in with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: loginUser.email,
      password: loginUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('rejects wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: loginUser.email,
      password: 'wrongpassword',
    });
    expect(res.statusCode).toBe(401);
  });

  it('rejects non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@nutrismart.test',
      password: 'anything',
    });
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/users/profile', () => {
  let token;

  beforeAll(async () => {
    const user = {
      name: 'Profile Test',
      email: `profiletest_${Date.now()}@nutrismart.test`,
      password: 'pass1234',
      age: 28, weight: 65, height: 170, diet: 'veg', goal: 'lose',
    };
    const res = await request(app).post('/api/auth/register').send(user);
    token = res.body.token;
  });

  it('returns profile for authenticated user', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('bmi');
    expect(res.body).toHaveProperty('dailyCaloriesGoal');
    expect(res.body).not.toHaveProperty('password');
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(app).get('/api/users/profile');
    expect(res.statusCode).toBe(401);
  });

  it('rejects invalid token', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toBe(401);
  });
});
