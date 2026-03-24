const request = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../main/config/app')
const MongoHelper = require('../infra/helpers/mongo-helper')

/**
 * E2E — POST /api/login
 *
 * Baseado na collection.json > Auth
 * Testa autenticação contra Docker MongoDB real com dados reais de bcrypt e JWT.
 */
describe('[E2E] POST /api/login', () => {
  let userModel

  beforeAll(async () => {
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  // ─── Happy path ──────────────────────────────────────────────────────────

  test('Should return 200 and accessToken when credentials are valid', async () => {
    await userModel.insertOne({
      name: 'John Doe',
      email: 'john@mail.com',
      password: await bcrypt.hash('secret123', 12)
    })

    const res = await request(app)
      .post('/api/login')
      .send({ email: 'john@mail.com', password: 'secret123' })
      .expect(200)

    expect(res.body).toHaveProperty('accessToken')
    expect(typeof res.body.accessToken).toBe('string')
    expect(res.body.accessToken.length).toBeGreaterThan(0)
  })

  test('Should return a valid JWT (3 parts separated by dot)', async () => {
    await userModel.insertOne({
      name: 'John Doe',
      email: 'john@mail.com',
      password: await bcrypt.hash('secret123', 12)
    })

    const res = await request(app)
      .post('/api/login')
      .send({ email: 'john@mail.com', password: 'secret123' })

    const parts = res.body.accessToken.split('.')
    expect(parts).toHaveLength(3)
  })

  test('Should persist the accessToken on user record after login', async () => {
    await userModel.insertOne({
      name: 'John Doe',
      email: 'john@mail.com',
      password: await bcrypt.hash('secret123', 12)
    })

    const res = await request(app)
      .post('/api/login')
      .send({ email: 'john@mail.com', password: 'secret123' })

    const user = await userModel.findOne({ email: 'john@mail.com' })
    expect(user.accessToken).toBe(res.body.accessToken)
  })

  // ─── Erros de entrada (400) ──────────────────────────────────────────────

  test('Should return 400 when email is missing — collection case: POST /login sem email', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ password: 'secret123' })
      .expect(400)

    expect(res.body.error).toBe('Missing param: email')
  })

  test('Should return 400 when password is missing — collection case: POST /login sem senha', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'john@mail.com' })
      .expect(400)

    expect(res.body.error).toBe('Missing param: password')
  })

  test('Should return 400 when email format is invalid — collection case: POST /login email inválido', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'nao-e-email', password: 'secret123' })
      .expect(400)

    expect(res.body.error).toBe('Invalid param: email')
  })

  test('Should return 400 when body is empty', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({})
      .expect(400)

    expect(res.body.error).toBe('Missing param: email')
  })

  // ─── Credenciais inválidas (401) ─────────────────────────────────────────

  test('Should return 401 when user does not exist — collection case: POST /login credenciais inválidas', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'inexistente@mail.com', password: 'qualquer' })
      .expect(401)

    expect(res.body.error).toBe('Unauthorized')
  })

  test('Should return 401 when password is wrong', async () => {
    await userModel.insertOne({
      name: 'John Doe',
      email: 'john@mail.com',
      password: await bcrypt.hash('secret123', 12)
    })

    const res = await request(app)
      .post('/api/login')
      .send({ email: 'john@mail.com', password: 'senha_errada' })
      .expect(401)

    expect(res.body.error).toBe('Unauthorized')
  })

  test('Should not expose password hash in any response', async () => {
    await userModel.insertOne({
      name: 'John Doe',
      email: 'john@mail.com',
      password: await bcrypt.hash('secret123', 12)
    })

    const res = await request(app)
      .post('/api/login')
      .send({ email: 'john@mail.com', password: 'secret123' })

    expect(JSON.stringify(res.body)).not.toContain('$2b$')
  })
})
