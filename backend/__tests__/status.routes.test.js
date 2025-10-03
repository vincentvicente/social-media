const request = require('supertest');
const express = require('express');
const statusRoutes = require('../routes/status.routes');
const { Status } = require('../models');

// Create Express app for testing
const app = express();
app.use(express.json());

// Mock authentication middleware
jest.mock('../authMiddleware', () => {
  return jest.fn((req, res, next) => {
    req.user = { userId: 'mockUserId' };
    next();
  });
});

app.use('/api/statuses', statusRoutes);

// Mock the models
jest.mock('../models', () => ({
  Status: {
    find: jest.fn(),
    findById: jest.fn(),
    prototype: {
      save: jest.fn(),
      deleteOne: jest.fn(),
    }
  }
}));

// Mock mongoose connection
jest.mock('../db', () => ({}));

describe('Status Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/statuses', () => {
    it('should create a new status', async () => {
      const mockStatus = {
        _id: 'status123',
        userId: 'mockUserId',
        content: 'Test status',
        save: jest.fn().mockResolvedValue(true)
      };

      Status.prototype.save = jest.fn().mockResolvedValue(mockStatus);

      const response = await request(app)
        .post('/api/statuses')
        .set('Authorization', 'Bearer mock-token')
        .send({ content: 'Test status' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Status created successfully');
    });

    it('should return 500 if status creation fails', async () => {
      Status.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/statuses')
        .set('Authorization', 'Bearer mock-token')
        .send({ content: 'Test status' });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Error creating status');
    });
  });

  describe('GET /api/statuses', () => {
    it('should get all statuses', async () => {
      const mockStatuses = [
        {
          _id: 'status1',
          content: 'Status 1',
          userId: { username: 'user1' }
        },
        {
          _id: 'status2',
          content: 'Status 2',
          userId: { username: 'user2' }
        }
      ];

      Status.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockStatuses)
      });

      const response = await request(app).get('/api/statuses');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('content', 'Status 1');
    });

    it('should return 500 if fetching statuses fails', async () => {
      Status.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      const response = await request(app).get('/api/statuses');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Error fetching statuses');
    });
  });

  describe('PUT /api/statuses/:id', () => {
    it('should update a status', async () => {
      const mockStatus = {
        _id: 'status123',
        userId: 'mockUserId',
        content: 'Old content',
        save: jest.fn().mockResolvedValue(true)
      };

      Status.findById.mockResolvedValue(mockStatus);

      const response = await request(app)
        .put('/api/statuses/status123')
        .set('Authorization', 'Bearer mock-token')
        .send({ content: 'Updated content' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Status updated successfully');
      expect(mockStatus.content).toBe('Updated content');
    });

    it('should return 404 if status not found', async () => {
      Status.findById.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/statuses/nonexistent')
        .set('Authorization', 'Bearer mock-token')
        .send({ content: 'Updated content' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Status not found');
    });

    it('should return 403 if user is not the author', async () => {
      const mockStatus = {
        _id: 'status123',
        userId: 'differentUserId',
        content: 'Old content'
      };

      Status.findById.mockResolvedValue(mockStatus);

      const response = await request(app)
        .put('/api/statuses/status123')
        .set('Authorization', 'Bearer mock-token')
        .send({ content: 'Updated content' });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'You do not have permission to edit this status');
    });
  });

  describe('DELETE /api/statuses/:id', () => {
    it('should delete a status', async () => {
      const mockStatus = {
        _id: 'status123',
        userId: 'mockUserId',
        deleteOne: jest.fn().mockResolvedValue(true)
      };

      Status.findById.mockResolvedValue(mockStatus);

      const response = await request(app)
        .delete('/api/statuses/status123')
        .set('Authorization', 'Bearer mock-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Status deleted successfully');
      expect(mockStatus.deleteOne).toHaveBeenCalled();
    });

    it('should return 404 if status not found', async () => {
      Status.findById.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/statuses/nonexistent')
        .set('Authorization', 'Bearer mock-token');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Status not found');
    });

    it('should return 403 if user is not the author', async () => {
      const mockStatus = {
        _id: 'status123',
        userId: 'differentUserId'
      };

      Status.findById.mockResolvedValue(mockStatus);

      const response = await request(app)
        .delete('/api/statuses/status123')
        .set('Authorization', 'Bearer mock-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'You do not have permission to delete this status');
    });
  });

  describe('POST /api/statuses/:id/like', () => {
    it('should like a status', async () => {
      const mockStatus = {
        _id: 'status123',
        likes: [],
        likesCount: 0,
        save: jest.fn().mockResolvedValue(true)
      };

      Status.findById.mockResolvedValue(mockStatus);

      const response = await request(app)
        .post('/api/statuses/status123/like')
        .set('Authorization', 'Bearer mock-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Status liked');
      expect(response.body.likesCount).toBe(1);
    });

    it('should unlike a status', async () => {
      const mockStatus = {
        _id: 'status123',
        likes: ['mockUserId'],
        likesCount: 1,
        indexOf: jest.fn(),
        save: jest.fn().mockResolvedValue(true)
      };

      // Mock indexOf to return 0 (found)
      mockStatus.likes.indexOf = jest.fn().mockReturnValue(0);

      Status.findById.mockResolvedValue(mockStatus);

      const response = await request(app)
        .post('/api/statuses/status123/like')
        .set('Authorization', 'Bearer mock-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Status unliked');
    });

    it('should return 404 if status not found', async () => {
      Status.findById.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/statuses/nonexistent/like')
        .set('Authorization', 'Bearer mock-token');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Status not found');
    });
  });
});

