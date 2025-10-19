const request = require('supertest')
const app = require('../config/app')

describe('Health Routes', () => {
  test('Should return 200 on health check', async () => {
    await request(app)
      .get('/api/health')
      .expect(200)
  })

  test('Should return correct health status format', async () => {
    const res = await request(app)
      .get('/api/health')
      .expect(200)

    expect(res.body).toHaveProperty('status', 'OK')
    expect(res.body).toHaveProperty('timestamp')
    expect(res.body).toHaveProperty('uptime')
    expect(res.body).toHaveProperty('environment')
    expect(res.body).toHaveProperty('version')
    expect(typeof res.body.uptime).toBe('number')
  })
})
