const request = require('supertest');
const app = require('../src/index');

describe('HubSpot Marketplace App', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('GET /oauth/hubspot/start', () => {
    it('should redirect to main backend with portalId', async () => {
      const portalId = '12345';
      const response = await request(app)
        .get('/oauth/hubspot/start')
        .query({ portalId })
        .expect(302);
      
      expect(response.headers.location).toContain('blihu.yoyaba.com');
      expect(response.headers.location).toContain(`portalId=${portalId}`);
    });

    it('should return 400 if portalId is missing', async () => {
      const response = await request(app)
        .get('/oauth/hubspot/start')
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'Missing portalId parameter');
    });
  });

  describe('GET /oauth/hubspot/callback', () => {
    it('should redirect to main backend with OAuth parameters', async () => {
      const code = 'auth_code_123';
      const state = 'state_456';
      const portalId = '12345';
      
      const response = await request(app)
        .get('/oauth/hubspot/callback')
        .query({ code, state, portalId })
        .expect(302);
      
      expect(response.headers.location).toContain('blihu.yoyaba.com');
      expect(response.headers.location).toContain(`code=${code}`);
      expect(response.headers.location).toContain(`state=${state}`);
      expect(response.headers.location).toContain(`portalId=${portalId}`);
    });

    it('should return 400 if required parameters are missing', async () => {
      const response = await request(app)
        .get('/oauth/hubspot/callback')
        .query({ code: 'auth_code' })
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'Missing required OAuth parameters');
    });
  });

  describe('POST /webhooks/hubspot/install', () => {
    it('should forward webhook to main backend', async () => {
      const webhookData = {
        portalId: '12345',
        subscriptionType: 'contact.propertyChange',
        appId: 'app_123'
      };
      
      // Mock fetch for testing
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200
        })
      );
      
      const response = await request(app)
        .post('/webhooks/hubspot/install')
        .send(webhookData)
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'forwarded');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://blihu.yoyaba.com/webhooks/hubspot/install',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(webhookData)
        })
      );
    });
  });

  describe('GET /cards/sync-status', () => {
    it('should redirect to main backend card endpoint', async () => {
      const portalId = '12345';
      const userId = 'user_123';
      
      const response = await request(app)
        .get('/cards/sync-status')
        .query({ portalId, userId })
        .expect(302);
      
      expect(response.headers.location).toContain('blihu.yoyaba.com');
      expect(response.headers.location).toContain(`portalId=${portalId}`);
      expect(response.headers.location).toContain(`userId=${userId}`);
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app)
        .get('/unknown-endpoint')
        .expect(404);
      
      expect(response.body).toHaveProperty('error', 'Endpoint not found');
    });
  });
});
