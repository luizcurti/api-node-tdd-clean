const { MissingParamError } = require('../../utils/errors')
const MongoHelper = require('../helpers/mongo-helper')
const { ObjectId } = require('mongodb')

module.exports = class UpdateUserRepository {
  async update (userId, data) {
    if (!userId) { throw new MissingParamError('userId') }
    if (!data) { throw new MissingParamError('data') }
    let objectId
    try {
      objectId = new ObjectId(userId)
    } catch {
      return null
    }
    const userModel = await MongoHelper.getCollection('users')
    return userModel.findOneAndUpdate(
      { _id: objectId },
      { $set: data },
      { returnDocument: 'after', projection: { password: 0, accessToken: 0 } }
    )
  }
}
