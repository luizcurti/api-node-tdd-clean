module.exports = {
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/src/**/*.js',
    '!**/src/main/**',
    '!**/*.spec.js',
    '!**/*.test.js'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  preset: '@shelf/jest-mongodb',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  forceExit: true,
  detectOpenHandles: false
}
