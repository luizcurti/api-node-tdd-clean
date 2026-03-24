jest.mock('bcrypt', () => ({
  isValid: true,
  hashedValue: 'hashed_value',

  async hash (value, rounds) {
    this.value = value
    this.rounds = rounds
    return this.hashedValue
  },

  async compare (value, hash) {
    this.value = value
    this.hash = hash
    return this.isValid
  }
}))

const bcrypt = require('bcrypt')
const MissingParamError = require('../errors/missing-param-error')
const Encrypter = require('./encrypter')

const makeSut = () => {
  return new Encrypter()
}

describe('Encrypter', () => {
  describe('hash()', () => {
    test('Should return a hashed value', async () => {
      const sut = makeSut()
      const hashed = await sut.hash('any_value')
      expect(hashed).toBe(bcrypt.hashedValue)
    })

    test('Should call bcrypt.hash with correct values', async () => {
      const sut = makeSut()
      await sut.hash('any_value')
      expect(bcrypt.value).toBe('any_value')
      expect(bcrypt.rounds).toBe(12)
    })

    test('Should throw if no value is provided to hash', async () => {
      const sut = makeSut()
      await expect(sut.hash()).rejects.toThrow(new MissingParamError('value'))
    })
  })

  describe('compare()', () => {
    test('Should return true if bcrypt returns true', async () => {
      const sut = makeSut()
      const isValid = await sut.compare('any_value', 'hashed_value')
      expect(isValid).toBe(true)
    })

    test('Should return false if bcrypt returns false', async () => {
      const sut = makeSut()
      bcrypt.isValid = false
      const isValid = await sut.compare('any_value', 'hashed_value')
      expect(isValid).toBe(false)
    })

    test('Should call bcrypt with correct values', async () => {
      const sut = makeSut()
      await sut.compare('any_value', 'hashed_value')
      expect(bcrypt.value).toBe('any_value')
      expect(bcrypt.hash).toBe('hashed_value')
    })

    test('Should throw if no params are provided', async () => {
      const sut = makeSut()
      await expect(sut.compare()).rejects.toThrow(new MissingParamError('value'))
      await expect(sut.compare('any_value')).rejects.toThrow(new MissingParamError('hash'))
    })
  })
})
