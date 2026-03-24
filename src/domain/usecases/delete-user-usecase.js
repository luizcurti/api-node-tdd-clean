const { MissingParamError } = require('../../utils/errors')

module.exports = class DeleteUserUseCase {
  constructor ({ deleteUserRepository } = {}) {
    this.deleteUserRepository = deleteUserRepository
  }

  async delete (userId) {
    if (!userId) { throw new MissingParamError('userId') }
    return this.deleteUserRepository.delete(userId)
  }
}
