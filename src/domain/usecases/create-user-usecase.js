const { MissingParamError } = require('../../utils/errors')

module.exports = class CreateUserUseCase {
  constructor ({ createUserRepository, loadUserByEmailRepository, encrypter } = {}) {
    this.createUserRepository = createUserRepository
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypter = encrypter
  }

  async create ({ name, email, password } = {}) {
    if (!name) { throw new MissingParamError('name') }
    if (!email) { throw new MissingParamError('email') }
    if (!password) { throw new MissingParamError('password') }
    const existingUser = await this.loadUserByEmailRepository.load(email)
    if (existingUser) { return null }
    const hashedPassword = await this.encrypter.hash(password)
    return this.createUserRepository.create({ name, email, password: hashedPassword })
  }
}
