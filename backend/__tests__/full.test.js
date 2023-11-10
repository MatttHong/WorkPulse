const request = require('supertest');
const app = require('../app'); // Adjust the path according to your project structure
const mongoose = require('mongoose');
const User = require('../models/user'); // Adjust the path according to your project structure

describe('POST /api/users', () => {
  beforeAll(async () => {
    // Connect to a test database before running tests
    await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    // Cleanup the test database and close the connection
    await mongoose.connection.close();
  });

  it('should create a new user', async () => {
    const newUser = {
      userName: 'testUser',
      password: 'password123',
      userType: 'basic',
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      birthday: '1990-01-01',
      bio: 'Just a test user.',
      employments: [],
      logs: []
    };

    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body).toHaveProperty('message', 'User added successfully');
    expect(response.body.post).toHaveProperty('id');

    // Verify user was inserted into the database
    const user = await User.findOne({ email: 'testuser@example.com' });
    expect(user).toBeTruthy();
    expect(user.userName).toBe(newUser.userName);

    // Clean up - delete user
    if (user) {
      await User.deleteOne({ _id: user._id });
    }
  });

  // Add more test cases as needed
});
