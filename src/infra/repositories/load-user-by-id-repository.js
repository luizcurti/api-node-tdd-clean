const { MissingParamError } = require('../../utils/errors')
const MongoHelper = require('../helpers/mongo-helper')
const { ObjectId } = require('mongodb')

module.exports = class LoadUserByIdRepository {
  async load (userId) {
    if (!userId) { throw new MissingParamError('userId') }
    let objectId
    try {
      objectId = new ObjectId(userId)
    } catch {
      return null
    }
    const userModel = await MongoHelper.getCollection('users')
    return userModel.findOne(
      { _id: objectId },
      { projection: { password: 0, accessToken: 0 } }
    )
  }
}
