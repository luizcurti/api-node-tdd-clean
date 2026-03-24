module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.e2e.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.e2e.setup.js'],
  forceExit: true,
  detectOpenHandles: false,
  testTimeout: 30000,
  coverageDirectory: 'coverage-e2e',
  collectCoverageFrom: [
    '**/src/**/*.js',
    '!**/src/main/index.js',
    '!**/*.spec.js',
    '!**/*.test.js',
    '!**/*.e2e.js'
  ]
}
