const bcrypt = require('bcrypt')
const MissingParamError = require('../errors/missing-param-error')

const SALT_ROUNDS = 12

module.exports = class Encrypter {
  async hash (value) {
    if (!value) {
      throw new MissingParamError('value')
    }
    return bcrypt.hash(value, SALT_ROUNDS)
  }

  async compare (value, hash) {
    if (!value) {
      throw new MissingParamError('value')
    }
    if (!hash) {
      throw new MissingParamError('hash')
    }
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
