const mongoose = require("mongoose");
const { apiUrl, MONGO, } = require('./utils/environment');

// const { initializeFirebase } = require('./utils/firebase');

module.exports = async () => {
  // Load environment variables from a .env.test file
//   require('dotenv').config({ path: '.env.test' });

  // Initialize Firebase for tests if needed
//   await initializeFirebase();

  // Connect to the MongoDB test database
  await mongoose.connect("mongodb://" + MONGO);

  const mongoURI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/testDatabase';
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Other global setup can go here...
};
