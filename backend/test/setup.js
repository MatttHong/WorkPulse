// test/setup.js
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const fs = require('fs');
const dotenv = require('dotenv');

const envPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env.test';

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    dotenv.config();
  }
module.exports = async () => {
  // Connect to the test database
  await mongoose.connect(`mongodb://${process.env.MONGO}`, { useNewUrlParser: true, useUnifiedTopology: true });

  const email = "gabe2002denton@gmail.com";
  const password = "asdf";
  // Use supertest to create a new user
  const userResponse = await supertest(app)
    .post('/api/users')
    .send({
      userName: 'testuser',
      password: password,
      userType: 'test',
      firstName: 'Test',
      lastName: 'User',
      email: email,
      birthday: '1990-01-01',
      bio: 'A test bio',
      employments: [],
      logs: []
    });
  // Check if the user was created successfully and get the ID
  if (userResponse.status !== 201) {
    throw new Error('Failed to create test user');
  }
  // console.log(userResponse.body)
  const userId = userResponse.body.post.id;
  // Use supertest to log in the user and get the auth token
  const authResponse = await supertest(app)
    .post('/api/auth')
    .send({
      email: email,
      password: password
    });

  // Check if the login was successful and get the token
  if (authResponse.status !== 200) {
    throw new Error('Failed to log in test user');
  }
  const authToken = authResponse.body.token;

  // Set the user ID and auth token as global variables
  global.__USER_ID__ = userId;
  global.__EMAIL__ = email;
  global.__PASSWORD__ = password;
  global.__AUTH_TOKEN__ = authToken;
};
