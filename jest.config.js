module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  collectCoverageFrom: [
    'frontend/src/**/*.{js,jsx}',
    'backend/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/frontend/src/main.jsx',
    '/backend/server.js'
  ]
};

