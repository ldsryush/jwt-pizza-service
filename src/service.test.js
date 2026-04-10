const request = require('supertest');
const app = require('./service');

describe('Service Tests', () => {
  test('root endpoint', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('welcome to JWT Pizza');
    expect(res.body).toHaveProperty('version');
  });

  test('get docs', async () => {
    const res = await request(app).get('/api/docs');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('endpoints');
    expect(res.body).toHaveProperty('config');
    expect(Array.isArray(res.body.endpoints)).toBe(true);
  });

  test('unknown endpoint', async () => {
    const res = await request(app).get('/unknown/endpoint');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('unknown endpoint');
  });

  test('cors headers', async () => {
    const res = await request(app)
      .get('/')
      .set('Origin', 'https://pizza.pizzasanghwa.click');
    
    expect(res.headers).toHaveProperty('access-control-allow-origin');
    expect(res.headers['access-control-allow-origin']).toBe('https://pizza.pizzasanghwa.click');
    expect(res.headers).toHaveProperty('access-control-allow-methods');
    expect(res.headers).toHaveProperty('access-control-allow-headers');
    expect(res.headers).toHaveProperty('access-control-allow-credentials');
  });

  test('cors headers blocked for unknown origin', async () => {
    const res = await request(app)
      .get('/')
      .set('Origin', 'http://malicious-site.com');
    
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});
