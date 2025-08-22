// Jest setup file
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.MAIN_BACKEND_URL = 'http://localhost:8000';

// Global test timeout
jest.setTimeout(10000);

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
