module.exports = {
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest',
    },
    moduleNameMapper: {
      '^components/(.*)$': '<rootDir>/src/components/$1',
      '^layouts/(.*)$': '<rootDir>/src/layouts/$1',
    },
    testEnvironment: 'jsdom',
     };
  