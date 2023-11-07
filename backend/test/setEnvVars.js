// test/setEnvVars.js

// Set the global variables to process.env so they can be used in tests
process.env.USER_ID = global.__USER_ID__;
process.env.AUTH_TOKEN = global.__AUTH_TOKEN__;
