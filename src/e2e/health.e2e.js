const request = require('supertest')
const app = require('../main/config/app')

/**
 * E2E — GET /api/health
 *
 * Baseado na collection.json > Health > GET /health
 * Testa a rota real contra Docker MongoDB.
 */
describe('[E2E] GET /api/health', () => {
  test('Should return 200 with correct status', async () => {
    const res = await request(app)
      .get('/api/health')
      .expect(200)

    expect(res.body.status).toBe('OK')
  })

  test('Should return all required fields', async () => {
    const res = await request(app)
      .get('/api/health')
      .expect(200)

    expect(res.body).toHaveProperty('status', 'OK')
    expect(res.body).toHaveProperty('timestamp')
    expect(res.body).toHaveProperty('uptime')
    expect(res.body).toHaveProperty('environment')
    expect(res.body).toHaveProperty('version')
  })

  test('Should return timestamp as valid ISO string', async () => {
    const res = await request(app).get('/api/health')
    const date = new Date(res.body.timestamp)
    expect(date.toString()).not.toBe('Invalid Date')
  })

  test('Should return uptime as a positive number', async () => {
    const res = await request(app).get('/api/health')
    expect(typeof res.body.uptime).toBe('number')
    expect(res.body.uptime).toBeGreaterThan(0)
  })

  test('Should return JSON content-type', async () => {
    await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
  })

  test('Should not expose X-Powered-By header', async () => {
    const res = await request(app).get('/api/health')
    expect(res.headers['x-powered-by']).toBeUndefined()
  })

  test('Should return CORS headers', async () => {
    const res = await request(app).get('/api/health')
    expect(res.headers['access-control-allow-origin']).toBe('*')
  })
})
