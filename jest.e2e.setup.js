const MongoHelper = require('./src/infra/helpers/mongo-helper')

const E2E_MONGO_URL =
  process.env.E2E_MONGO_URL ||
  'mongodb://admin:admin123@localhost:27017/clean-node-api-e2e?authSource=admin'

const connectWithRetry = async (url, maxRetries = 10, delayMs = 2000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await MongoHelper.connect(url)
      console.log(`[E2E] Connected to MongoDB (attempt ${attempt})`)
      return
    } catch (err) {
      if (attempt === maxRetries) {
        throw new Error(
          `[E2E] Could not connect to MongoDB after ${maxRetries} attempts.\n` +
          'Make sure Docker is running: npm run docker:db\n' +
          `Error: ${err.message}`
        )
      }
      console.log(`[E2E] MongoDB not ready, retrying in ${delayMs}ms... (${attempt}/${maxRetries})`)
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }
}

beforeAll(async () => {
  await connectWithRetry(E2E_MONGO_URL)
})

afterAll(async () => {
  if (MongoHelper.client) {
    await MongoHelper.db.dropDatabase()
    console.log('[E2E] Dropped E2E test database')
    await MongoHelper.disconnect()
  }
})
