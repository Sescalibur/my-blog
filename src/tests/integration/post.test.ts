import request from 'supertest';
import { app } from '../../app';
import { connect, clearDatabase, closeDatabase } from '../../test-db-setup';
import { Post } from '../../models/Post';
import { User } from '../../models/User';
import mongoose from 'mongoose';
import { mockSession } from '../__mocks__/auth';
import { getServerSession } from 'next-auth/next';

describe('Post API', () => {
  let testUser: any;

  beforeAll(async () => {
    await connect();
    // Test user'ı mockSession'daki ID ile oluştur
    testUser = await User.create({
      _id: new mongoose.Types.ObjectId(mockSession.user.id),
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
  });

  beforeEach(() => {
    // Mock authenticated session
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  });

  afterEach(async () => {
    await clearDatabase();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({
          title: 'Test Post',
          content: 'Test Content'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('title', 'Test Post');
      expect(res.body).toHaveProperty('author', mockSession.user.id);
    });

    it('should return 401 if not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app)
        .post('/api/posts')
        .send({
          title: 'Test Post',
          content: 'Test Content'
        });

      expect(res.status).toBe(401);
    });

    it('should return 400 for invalid data', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({
          title: 'a', // too short
          content: 'too short'
        })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('errors')
    })

    it('should return 400 for missing fields', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({
          title: 'Only Title'
        })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('errors')
    })
  });

  describe('GET /api/posts', () => {
    it('should return all posts', async () => {
      // Create test posts
      await Post.create([
        {
          title: 'Post 1',
          content: 'Content 1',
          author: testUser._id
        },
        {
          title: 'Post 2',
          content: 'Content 2',
          author: testUser._id
        }
      ]);

      const res = await request(app).get('/api/posts');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('title', 'Post 1');
      expect(res.body[1]).toHaveProperty('title', 'Post 2');
    });
  });
}); 