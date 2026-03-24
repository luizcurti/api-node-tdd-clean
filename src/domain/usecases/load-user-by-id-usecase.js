const { MissingParamError } = require('../../utils/errors')

module.exports = class LoadUserByIdUseCase {
  constructor ({ loadUserByIdRepository } = {}) {
    this.loadUserByIdRepository = loadUserByIdRepository
  }

  async load (userId) {
    if (!userId) { throw new MissingParamError('userId') }
    return this.loadUserByIdRepository.load(userId)
  }
}
