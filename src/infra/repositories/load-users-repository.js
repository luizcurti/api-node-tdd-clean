const MongoHelper = require('../helpers/mongo-helper')

module.exports = class LoadUsersRepository {
  async load () {
    const userModel = await MongoHelper.getCollection('users')
    const users = await userModel
      .find({}, { projection: { password: 0, accessToken: 0 } })
      .toArray()
    return users
  }
}
