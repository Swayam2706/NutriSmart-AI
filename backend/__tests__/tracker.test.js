const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

let app;
let token;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key';
  await mongoose.connect(process.env.MONGODB_URI);
  app = require('../server');

  // Register and login a test user
  const user = {
    name: 'Tracker Test',
    email: `trackertest_${Date.now()}@nutrismart.test`,
    password: 'pass1234',
    age: 25, weight: 70, height: 175, diet: 'veg', goal: 'maintain',
  };
  const res = await request(app).post('/api/auth/register').send(user);
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.collection('users').deleteMany({ email: /trackertest.*@nutrismart\.test/ });
  await mongoose.connection.collection('dailytrackers').deleteMany({});
  await mongoose.disconnect();
});

describe('GET /api/tracker/today', () => {
  it('returns today tracker with dailyGoal', async () => {
    const res = await request(app)
      .get('/api/tracker/today')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('dailyGoal');
    expect(res.body).toHaveProperty('remainingCalories');
    expect(res.body).toHaveProperty('meals');
    expect(Array.isArray(res.body.meals)).toBe(true);
  });
});

describe('POST /api/tracker/add', () => {
  it('adds a meal and updates totals', async () => {
    const res = await request(app)
      .post('/api/tracker/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Oats', calories: 300, timeOfDay: 'breakfast' });
    expect(res.statusCode).toBe(201);
    expect(res.body.totalCaloriesCons).toBeGreaterThanOrEqual(300);
    expect(res.body.meals.some(m => m.name === 'Oats')).toBe(true);
  });

  it('rejects meal with invalid timeOfDay', async () => {
    const res = await request(app)
      .post('/api/tracker/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Pizza', calories: 500, timeOfDay: 'midnight' });
    expect(res.statusCode).toBe(400);
  });

  it('rejects meal with missing name', async () => {
    const res = await request(app)
      .post('/api/tracker/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ calories: 200, timeOfDay: 'lunch' });
    expect(res.statusCode).toBe(400);
  });
});

describe('DELETE /api/tracker/meal/:mealId', () => {
  it('deletes a meal and reduces total calories', async () => {
    // Add a meal first
    const addRes = await request(app)
      .post('/api/tracker/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Salad', calories: 150, timeOfDay: 'lunch' });

    const mealId = addRes.body.meals.find(m => m.name === 'Salad')._id;
    const calsBefore = addRes.body.totalCaloriesCons;

    const delRes = await request(app)
      .delete(`/api/tracker/meal/${mealId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(delRes.statusCode).toBe(200);
    expect(delRes.body.totalCaloriesCons).toBe(calsBefore - 150);
  });

  it('returns 400 for invalid meal ID format', async () => {
    const res = await request(app)
      .delete('/api/tracker/meal/not-a-valid-id')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
  });
});
