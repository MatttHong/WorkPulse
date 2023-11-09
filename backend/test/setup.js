const mongoose = require("mongoose");
const axios = require('axios');
const { apiUrl, testMongo, } = require('../utils/environment');

// const { initializeFirebase } = require('./utils/firebase');

module.exports = async () => {
  // Load environment variables from a .env.test file
//   require('dotenv').config({ path: '.env.test' });

  // Initialize Firebase for tests if needed
//   await initializeFirebase();

  // Connect to the MongoDB test database
  await mongoose.connect(testMongo);
  const userResponse = await axios.post(`${apiUrl}/api/users`, {
    "username" : "abcd",
    "password" : "abcd",
    "firstName" : "tester1",
    "lastName" : "IBeTesting",
    "email" : "gabe2002denton@gmail.com"
  });
  
  // Save the user _id to a global variable
  global.__USER_ID__ = userResponse.data._id;
  console.log("I am here")
  // Authenticate the user
  const authResponse = await axios.post(`${apiUrl}/api/auth`, {
    // ... credentials
  });

  // Save the token to a global variable
  global.__AUTH_TOKEN__ = authResponse.data.token;

  // Other global setup can go here...
};
