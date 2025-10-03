const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRoutes = require('../routes/user.routes');
const { User, Status } = require('../models');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

// Mock the models
jest.mock('../models', () => ({
  User: {
    findOne: jest.fn(),
    findById: jest.fn(),
    prototype: {
      save: jest.fn(),
    }
  },
  Status: {
    find: jest.fn(),
  }
}));

// Mock bcrypt
jest.mock('bcrypt');

// Mock jwt
jest.mock('jsonwebtoken');

// Mock mongoose connection
jest.mock('../db', () => ({}));

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        username: 'testuser',
        password: 'hashedpassword',
        save: jest.fn().mockResolvedValue(true)
      };

      bcrypt.hash.mockResolvedValue('hashedpassword');
      User.prototype.save = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/users/register')
        .send({ username: 'testuser', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });

    it('should return 500 if registration fails', async () => {
      bcrypt.hash.mockRejectedValue(new Error('Hashing failed'));

      const response = await request(app)
        .post('/api/users/register')
        .send({ username: 'testuser', password: 'password123' });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Error creating user');
    });
  });

  describe('POST /api/users/login', () => {
    it('should login user with correct credentials', async () => {
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        password: 'hashedpassword'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock-token');

      const response = await request(app)
        .post('/api/users/login')
        .send({ username: 'testuser', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'mock-token');
      expect(response.body).toHaveProperty('userId', 'user123');
    });

    it('should return 401 with invalid credentials', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/users/login')
        .send({ username: 'wronguser', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid username or password');
    });

    it('should return 401 with incorrect password', async () => {
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        password: 'hashedpassword'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/users/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid username or password');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by ID with statuses', async () => {
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        description: 'Test description',
        select: jest.fn().mockReturnThis()
      };

      const mockStatuses = [
        { _id: 'status1', content: 'Test status', createdAt: new Date() }
      ];

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      Status.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockStatuses)
      });

      const response = await request(app).get('/api/users/user123');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('statuses');
    });

    it('should return 404 if user not found', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      const response = await request(app).get('/api/users/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'User not found');
    });
  });
});

