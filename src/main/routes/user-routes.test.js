const request = require('supertest')
const app = require('../config/app')
const { ObjectId } = require('mongodb')
const bcrypt = require('bcrypt')
const MongoHelper = require('../../infra/helpers/mongo-helper')
let userModel

describe('User Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /api/users', () => {
    test('Should return 201 when creating a user with valid data', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'john@mail.com', password: 'secret123' })
        .expect(201)
      expect(res.body).toHaveProperty('_id')
      expect(res.body.name).toBe('John Doe')
      expect(res.body.email).toBe('john@mail.com')
      expect(res.body).not.toHaveProperty('password')
    })

    test('Should return 400 when name is missing', async () => {
      await request(app)
        .post('/api/users')
        .send({ email: 'john@mail.com', password: 'secret123' })
        .expect(400)
    })

    test('Should return 400 when email is missing', async () => {
      await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', password: 'secret123' })
        .expect(400)
    })

    test('Should return 400 when email is invalid', async () => {
      await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'not-an-email', password: 'secret123' })
        .expect(400)
    })

    test('Should return 400 when password is missing', async () => {
      await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'john@mail.com' })
        .expect(400)
    })

    test('Should return 409 when email already in use', async () => {
      await userModel.insertOne({
        name: 'Existing User',
        email: 'existing@mail.com',
        password: bcrypt.hashSync('password', 10)
      })
      await request(app)
        .post('/api/users')
        .send({ name: 'New User', email: 'existing@mail.com', password: 'newpass' })
        .expect(409)
    })

    test('Should hash the password before saving', async () => {
      await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'john@mail.com', password: 'plain_password' })
        .expect(201)
      const user = await userModel.findOne({ email: 'john@mail.com' })
      expect(user.password).not.toBe('plain_password')
      const isValid = await bcrypt.compare('plain_password', user.password)
      expect(isValid).toBe(true)
    })
  })

  describe('GET /api/users', () => {
    test('Should return 200 with empty list when no users exist', async () => {
      const res = await request(app).get('/api/users').expect(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body).toHaveLength(0)
    })

    test('Should return 200 with list of users', async () => {
      await userModel.insertMany([
        { name: 'User 1', email: 'user1@mail.com', password: 'hash1' },
        { name: 'User 2', email: 'user2@mail.com', password: 'hash2' }
      ])
      const res = await request(app).get('/api/users').expect(200)
      expect(res.body).toHaveLength(2)
      expect(res.body[0]).not.toHaveProperty('password')
      expect(res.body[0]).not.toHaveProperty('accessToken')
    })
  })

  describe('GET /api/users/:id', () => {
    test('Should return 200 when user is found', async () => {
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
      expect(res.body).not.toHaveProperty('password')
    })

    test('Should return 404 when user is not found', async () => {
      const fakeId = new ObjectId()
      await request(app).get(`/api/users/${fakeId}`).expect(404)
    })

    test('Should return 404 when id format is invalid', async () => {
      await request(app).get('/api/users/invalid-id').expect(404)
    })
  })

  describe('PUT /api/users/:id', () => {
    test('Should return 200 when user is updated', async () => {
      const result = await userModel.insertOne({
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'hashed_password'
      })
      const res = await request(app)
        .put(`/api/users/${result.insertedId}`)
        .send({ name: 'Updated Name' })
        .expect(200)
      expect(res.body.name).toBe('Updated Name')
      expect(res.body).not.toHaveProperty('password')
    })

    test('Should return 404 when user to update is not found', async () => {
      const fakeId = new ObjectId()
      await request(app)
        .put(`/api/users/${fakeId}`)
        .send({ name: 'Updated Name' })
        .expect(404)
    })

    test('Should return 400 when body is empty', async () => {
      const result = await userModel.insertOne({
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'hashed_password'
      })
      await request(app)
        .put(`/api/users/${result.insertedId}`)
        .send({})
        .expect(400)
    })
  })

  describe('DELETE /api/users/:id', () => {
    test('Should return 204 when user is deleted', async () => {
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

    test('Should return 404 when user to delete is not found', async () => {
      const fakeId = new ObjectId()
      await request(app).delete(`/api/users/${fakeId}`).expect(404)
    })
  })
})
