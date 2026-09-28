const request = require('supertest');

// Mock environment before importing app
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only-32chars';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

// Mock Supabase
jest.mock('../../src/config/supabase', () => {
  const mockFrom = jest.fn();
  return { from: mockFrom };
});

const supabase = require('../../src/config/supabase');

// Helper to setup mock chains
const createMockChain = (finalData = null, finalError = null) => {
  const chain = {};
  const methods = ['select', 'insert', 'update', 'delete', 'eq', 'or', 'gte', 'lte',
    'ilike', 'order', 'limit', 'range', 'single', 'in'];

  methods.forEach((method) => {
    chain[method] = jest.fn().mockReturnValue(chain);
  });

  // Terminal method returns the result
  chain.single = jest.fn().mockResolvedValue({ data: finalData, error: finalError });
  chain.select = jest.fn().mockImplementation(() => {
    chain._select = true;
    return chain;
  });

  // Override to return result when no more chaining
  const originalOrder = chain.order;
  chain.order = jest.fn().mockImplementation(() => {
    return {
      ...chain,
      limit: jest.fn().mockResolvedValue({ data: Array.isArray(finalData) ? finalData : [finalData], error: finalError }),
      range: jest.fn().mockResolvedValue({ data: Array.isArray(finalData) ? finalData : [finalData], error: finalError }),
      then: (resolve) => resolve({ data: Array.isArray(finalData) ? finalData : [finalData], error: finalError }),
    };
  });

  return chain;
};

describe('Auth API', () => {
  let app;

  beforeAll(() => {
    app = require('../../src/app');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'Password123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 if email is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'not-an-email', password: 'Password123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 if password is too short', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'test@example.com', password: '12' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 if password lacks uppercase letter', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'Password123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 if no token is provided', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 if token is invalid', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});

describe('Protected Routes', () => {
  let app;

  beforeAll(() => {
    app = require('../../src/app');
  });

  it('GET /api/transactions should require authentication', async () => {
    const res = await request(app).get('/api/transactions');
    expect(res.status).toBe(401);
  });

  it('POST /api/transactions should require authentication', async () => {
    const res = await request(app).post('/api/transactions').send({});
    expect(res.status).toBe(401);
  });

  it('GET /api/budgets should require authentication', async () => {
    const res = await request(app).get('/api/budgets');
    expect(res.status).toBe(401);
  });

  it('GET /api/savings-goals should require authentication', async () => {
    const res = await request(app).get('/api/savings-goals');
    expect(res.status).toBe(401);
  });

  it('GET /api/analytics/summary should require authentication', async () => {
    const res = await request(app).get('/api/analytics/summary');
    expect(res.status).toBe(401);
  });

  it('GET /api/recommendations should require authentication', async () => {
    const res = await request(app).get('/api/recommendations');
    expect(res.status).toBe(401);
  });

  it('GET /api/users/profile should require authentication', async () => {
    const res = await request(app).get('/api/users/profile');
    expect(res.status).toBe(401);
  });
});

describe('Health Check', () => {
  let app;

  beforeAll(() => {
    app = require('../../src/app');
  });

  it('GET /api/health should return 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('404 Handler', () => {
  let app;

  beforeAll(() => {
    app = require('../../src/app');
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('Validation', () => {
  let app;

  beforeAll(() => {
    app = require('../../src/app');
  });

  it('should reject registration with empty body', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});
