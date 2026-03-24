module.exports = class LoadUsersUseCase {
  constructor ({ loadUsersRepository } = {}) {
    this.loadUsersRepository = loadUsersRepository
  }

  async load () {
    return this.loadUsersRepository.load()
  }
}
