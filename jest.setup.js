const MongoHelper = require('./src/infra/helpers/mongo-helper')

afterAll(async () => {
  if (MongoHelper.client) {
    await MongoHelper.disconnect()
  }
})