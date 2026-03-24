const { MissingParamError } = require('../../utils/errors')

module.exports = class UpdateUserUseCase {
  constructor ({ updateUserRepository } = {}) {
    this.updateUserRepository = updateUserRepository
  }

  async update (userId, data) {
    if (!userId) { throw new MissingParamError('userId') }
    if (!data) { throw new MissingParamError('data') }
    return this.updateUserRepository.update(userId, data)
  }
}
