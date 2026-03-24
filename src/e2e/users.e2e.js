const request = require('supertest')
const { ObjectId } = require('mongodb')
const app = require('../main/config/app')
const MongoHelper = require('../infra/helpers/mongo-helper')

/**
 * E2E — Users CRUD: POST / GET / PUT / DELETE /api/users
 *
 * Baseado na collection.json > Users
 * Testa todas as rotas de usuário contra Docker MongoDB real.
 */
describe('[E2E] Users CRUD', () => {
  let userModel

  beforeAll(async () => {
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // POST /api/users — Criar usuário
  // ═══════════════════════════════════════════════════════════════════════════
  describe('POST /api/users', () => {
    test('Should return 201 and user body when data is valid — collection case: criar usuário', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'john@mail.com', password: 'secret123' })
        .expect(201)

      expect(res.body).toHaveProperty('_id')
      expect(res.body.name).toBe('John Doe')
      expect(res.body.email).toBe('john@mail.com')
      expect(res.body).not.toHaveProperty('password')
      expect(res.body).not.toHaveProperty('accessToken')
    })

    test('Should persist user in database after creation', async () => {
      await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'john@mail.com', password: 'secret123' })

      const user = await userModel.findOne({ email: 'john@mail.com' })
      expect(user).not.toBeNull()
      expect(user.name).toBe('John Doe')
    })

    test('Should hash the password before saving to database', async () => {
      await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'john@mail.com', password: 'plain_password' })

      const user = await userModel.findOne({ email: 'john@mail.com' })
      expect(user.password).not.toBe('plain_password')
      expect(user.password).toMatch(/^\$2b\$/)
    })

    test('Should return 400 when name is missing — collection case: sem name', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ email: 'john@mail.com', password: 'secret123' })
        .expect(400)

      expect(res.body.error).toBe('Missing param: name')
    })

    test('Should return 400 when email is missing — collection case: sem email', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', password: 'secret123' })
        .expect(400)

      expect(res.body.error).toBe('Missing param: email')
    })

    test('Should return 400 when email is invalid — collection case: email inválido', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'nao-e-email', password: 'secret123' })
        .expect(400)

      expect(res.body.error).toBe('Invalid param: email')
    })

    test('Should return 400 when password is missing — collection case: sem password', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'john@mail.com' })
        .expect(400)

      expect(res.body.error).toBe('Missing param: password')
    })

    test('Should return 409 when email is already in use — collection case: email duplicado', async () => {
      await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'john@mail.com', password: 'secret123' })

      const res = await request(app)
        .post('/api/users')
        .send({ name: 'Jane Doe', email: 'john@mail.com', password: 'outro123' })
        .expect(409)

      expect(res.body.error).toBe('Email already in use')
    })

    test('Should not create duplicate user in DB on 409', async () => {
      await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'john@mail.com', password: 'secret123' })
      await request(app)
        .post('/api/users')
        .send({ name: 'Jane Doe', email: 'john@mail.com', password: 'outro' })

      const count = await userModel.countDocuments({ email: 'john@mail.com' })
      expect(count).toBe(1)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // GET /api/users — Listar todos
  // ═══════════════════════════════════════════════════════════════════════════
  describe('GET /api/users', () => {
    test('Should return 200 with empty array when no users exist — collection case: listar todos', async () => {
      const res = await request(app)
        .get('/api/users')
        .expect(200)

      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body).toHaveLength(0)
    })

    test('Should return 200 with list of users after creation', async () => {
      await userModel.insertMany([
        { name: 'User 1', email: 'user1@mail.com', password: 'hash1' },
        { name: 'User 2', email: 'user2@mail.com', password: 'hash2' }
      ])

      const res = await request(app)
        .get('/api/users')
        .expect(200)

      expect(res.body).toHaveLength(2)
    })

    test('Should not expose password or accessToken in list', async () => {
      await userModel.insertOne({
        name: 'User 1',
        email: 'user1@mail.com',
        password: 'hashed_pass',
        accessToken: 'some_token'
      })

      const res = await request(app).get('/api/users')

      expect(res.body[0]).not.toHaveProperty('password')
      expect(res.body[0]).not.toHaveProperty('accessToken')
    })

    test('Should return users with _id, name and email fields', async () => {
      await userModel.insertOne({ name: 'User 1', email: 'user1@mail.com', password: 'hash1' })

      const res = await request(app).get('/api/users')

      expect(res.body[0]).toHaveProperty('_id')
      expect(res.body[0]).toHaveProperty('name')
      expect(res.body[0]).toHaveProperty('email')
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // GET /api/users/:id — Buscar por ID
  // ═══════════════════════════════════════════════════════════════════════════
  describe('GET /api/users/:id', () => {
    test('Should return 200 with user data when found — collection case: buscar por ID', async () => {
      const result = await userModel.insertOne({
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'hashed_password'
      })

      const res = await request(app)
        .get(`/api/users/${result.insertedId}`)
        .expect(200)

      expect(res.body.name).toBe('John Doe')
      expect(res.body.email).toBe('john@mail.com')
      expect(res.body).toHaveProperty('_id')
    })

    test('Should not expose password when fetching by id', async () => {
      const result = await userModel.insertOne({
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'hashed_password',
        accessToken: 'any_token'
      })

      const res = await request(app).get(`/api/users/${result.insertedId}`)

      expect(res.body).not.toHaveProperty('password')
      expect(res.body).not.toHaveProperty('accessToken')
    })

    test('Should return 404 when user does not exist — collection case: não encontrado', async () => {
      const fakeId = new ObjectId()
      const res = await request(app)
        .get(`/api/users/${fakeId}`)
        .expect(404)

      expect(res.body.error).toBe('User not found')
    })

    test('Should return 404 when id format is invalid (not ObjectId)', async () => {
      const res = await request(app)
        .get('/api/users/id-invalido')
        .expect(404)

      expect(res.body.error).toBe('User not found')
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // PUT /api/users/:id — Atualizar
  // ═══════════════════════════════════════════════════════════════════════════
  describe('PUT /api/users/:id', () => {
    test('Should return 200 with updated user — collection case: atualizar', async () => {
      const result = await userModel.insertOne({
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'hashed_password'
      })

      const res = await request(app)
        .put(`/api/users/${result.insertedId}`)
        .send({ name: 'John Updated' })
        .expect(200)

      expect(res.body.name).toBe('John Updated')
      expect(res.body.email).toBe('john@mail.com')
      expect(res.body).not.toHaveProperty('password')
    })

    test('Should persist the update in database', async () => {
      const result = await userModel.insertOne({
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'hashed_password'
      })

      await request(app)
        .put(`/api/users/${result.insertedId}`)
        .send({ name: 'John Updated' })

      const updated = await userModel.findOne({ _id: result.insertedId })
      expect(updated.name).toBe('John Updated')
    })

    test('Should return 400 when body is empty — collection case: body vazio', async () => {
      const result = await userModel.insertOne({
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'hashed_password'
      })

      const res = await request(app)
        .put(`/api/users/${result.insertedId}`)
        .send({})
        .expect(400)

      expect(res.body.error).toBe('Missing param: body')
    })

    test('Should return 404 when user does not exist — collection case: não encontrado', async () => {
      const fakeId = new ObjectId()
      const res = await request(app)
        .put(`/api/users/${fakeId}`)
        .send({ name: 'John Updated' })
        .expect(404)

      expect(res.body.error).toBe('User not found')
    })

    test('Should return 404 when id format is invalid', async () => {
      const res = await request(app)
        .put('/api/users/id-invalido')
        .send({ name: 'John Updated' })
        .expect(404)

      expect(res.body.error).toBe('User not found')
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // DELETE /api/users/:id — Deletar
  // ═══════════════════════════════════════════════════════════════════════════
  describe('DELETE /api/users/:id', () => {
    test('Should return 204 and remove user — collection case: deletar', async () => {
      const result = await userModel.insertOne({
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'hashed_password'
      })

      await request(app)
        .delete(`/api/users/${result.insertedId}`)
        .expect(204)

      const deletedUser = await userModel.findOne({ _id: result.insertedId })
      expect(deletedUser).toBeNull()
    })

    test('Should return empty body on 204', async () => {
      const result = await userModel.insertOne({
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'hashed_password'
      })

      const res = await request(app).delete(`/api/users/${result.insertedId}`)
      expect(res.text).toBe('')
    })

    test('Should return 404 when user does not exist — collection case: não encontrado', async () => {
      const fakeId = new ObjectId()
      const res = await request(app)
        .delete(`/api/users/${fakeId}`)
        .expect(404)

      expect(res.body.error).toBe('User not found')
    })

    test('Should return 404 when id format is invalid', async () => {
      const res = await request(app)
        .delete('/api/users/id-invalido')
        .expect(404)

      expect(res.body.error).toBe('User not found')
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // Fluxo completo — jornada do usuário do cadastro ao delete
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Full user journey', () => {
    test('Should complete full CRUD cycle: create → list → get → update → login → delete', async () => {
      // 1. Criar usuário
      const createRes = await request(app)
        .post('/api/users')
        .send({ name: 'Journey User', email: 'journey@mail.com', password: 'pass123' })
        .expect(201)

      const userId = createRes.body._id
      expect(userId).toBeTruthy()

      // 2. Listar — deve aparecer na lista
      const listRes = await request(app).get('/api/users').expect(200)
      const found = listRes.body.find(u => u.email === 'journey@mail.com')
      expect(found).toBeTruthy()
      expect(found).not.toHaveProperty('password')

      // 3. Buscar por ID
      const getRes = await request(app).get(`/api/users/${userId}`).expect(200)
      expect(getRes.body.name).toBe('Journey User')

      // 4. Atualizar nome
      const updateRes = await request(app)
        .put(`/api/users/${userId}`)
        .send({ name: 'Journey Updated' })
        .expect(200)
      expect(updateRes.body.name).toBe('Journey Updated')

      // 5. Login com a senha original
      const loginRes = await request(app)
        .post('/api/login')
        .send({ email: 'journey@mail.com', password: 'pass123' })
        .expect(200)
      expect(loginRes.body.accessToken).toBeTruthy()

      // 6. Deletar
      await request(app).delete(`/api/users/${userId}`).expect(204)

      // 7. Confirma que foi removido
      await request(app).get(`/api/users/${userId}`).expect(404)
    })
  })
})
