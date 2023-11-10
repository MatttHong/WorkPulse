// test/teardown.js
const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

module.exports = async () => {
  // Use supertest to delete the user created in setup.js
  await supertest(app)
    .delete(`/api/users/${global.__USER_ID__}`)
    .set('Authorization', `Bearer ${global.__AUTH_TOKEN__}`);

  // Disconnect from the test database
  await mongoose.disconnect();
};
