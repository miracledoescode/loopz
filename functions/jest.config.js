module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^node-fetch$': '<rootDir>/__mocks__/node-fetch.js'
  }
};
