// test/teardown.js
const axios = require('axios');
const mongoose = require('mongoose');
const { apiUrl } = require('./utils/environment');

module.exports = async () => {
  // Delete the user using the API
  await axios.delete(`${apiUrl}/api/users/${global.__USER_ID__}`, {
    headers: {
      Authorization: `Bearer ${global.__AUTH_TOKEN__}`,
    },
  });

  // Close the mongoose connection
  await mongoose.connection.close();
};
