const { MissingParamError } = require('../../utils/errors')
const MongoHelper = require('../helpers/mongo-helper')
const { ObjectId } = require('mongodb')

module.exports = class DeleteUserRepository {
  async delete (userId) {
    if (!userId) { throw new MissingParamError('userId') }
    let objectId
    try {
      objectId = new ObjectId(userId)
    } catch {
      return false
    }
    const userModel = await MongoHelper.getCollection('users')
    const result = await userModel.deleteOne({ _id: objectId })
    return result.deletedCount > 0
  }
}
