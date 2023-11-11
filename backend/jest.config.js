module.exports = {
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true, 

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // If you want to collect coverage from specific directories or files, you can use the following option
  // coveragePathIgnorePatterns: [
  //   "/node_modules/"
  // ],
  testTimeout: 10000, // 10 seconds in milliseconds
  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ["json", "text", "lcov", "clover"],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/__tests__/**/*.js?(x)",
    "**/?(*.)+(spec|test).js?(x)"
  ],

  // A map from regular expressions to paths to transformers
  // You may not need this unless you are using TypeScript or other compile-to-JS languages
  // transform: {
  //   "^.+\\.tsx?$": "ts-jest",
  // },

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  // testPathIgnorePatterns: [
  //   "/node_modules/"
  // ],

  // This option allows the use of a custom global setup module which exports an async function that is triggered once before all test suites
  globalSetup: "<rootDir>/test/setup.js", // Path to your setup file

  // This option allows the use of a custom global teardown module which exports an async function that is triggered once after all test suites
  globalTeardown: "<rootDir>/test/teardown.js", // Path to your teardown file

  // Setup files before the tests are run
  // setupFilesAfterEnv: ["<rootDir>/test/setEnvVars.js"] // If you need to set environment variables
};
