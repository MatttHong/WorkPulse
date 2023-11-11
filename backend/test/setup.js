// test/setup.js
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const fs = require('fs');
const dotenv = require('dotenv');
const { appendToList, getToken, lockToken, unlockToken, addToken, initList } = require('../utils/moduleForTestingSupport');


const envPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env.test';

if (fs.existsSync(envPath)) {
  initList();
  dotenv.config({ path: envPath });
} else {
  initList();
  dotenv.config();
}

  
module.exports = async () => {
  // Connect to the test database
  // lockToken();
  const email = "gabe2002denton@gmail.com";
  const password = "A1!BcDsdf";

  process.env.EMAIL = email;
  process.env.PASSWORD = password;

  await mongoose.connect(`mongodb://${process.env.MONGO}`, { useNewUrlParser: true, useUnifiedTopology: true });

  // Use supertest to create a new user
  let userId;
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
      logs: [],
    });
  // Check if the user was created successfully and get the ID
  if (userResponse.status !== 201) {
    if (userResponse.body.error === "User already exists." || userResponse.body.message === "User already exists.") {
      // Handle the "User already exists" error
      // You can choose to handle it here or throw an error
      // throw new Error('User already exists. Handle the error accordingly.');
    } else {    
      throw new Error('Failed to create test user');
    }
  } else {
    userId = userResponse.body.post.id;
    // if (userId){
    //   appendToList(['users', userId]);
    // }
  }
  // lockToken();
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
  process.env.AUTH_TOKEN = authToken;

  // addToken(authToken)
  console.log(authToken)
  console.log("-----------------------------------------")
  // unlockToken()
  console.log(global.__TEST_STATE__)
  if (!userId){
    userId = authResponse.body.data._id;
    // if (userId){
    //   appendToList(['users', userId]);
    // }
  }
  process.env.USER_ID = userId;
  
    await mongoose.connection.close();
};
