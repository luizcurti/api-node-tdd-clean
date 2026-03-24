const HttpResponse = require('../helpers/http-response')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

module.exports = class UserRouter {
  constructor ({
    createUserUseCase,
    loadUsersUseCase,
    loadUserByIdUseCase,
    updateUserUseCase,
    deleteUserUseCase,
    emailValidator
  } = {}) {
    this.createUserUseCase = createUserUseCase
    this.loadUsersUseCase = loadUsersUseCase
    this.loadUserByIdUseCase = loadUserByIdUseCase
    this.updateUserUseCase = updateUserUseCase
    this.deleteUserUseCase = deleteUserUseCase
    this.emailValidator = emailValidator
  }

  async create (httpRequest) {
    try {
      const { name, email, password } = httpRequest.body
      if (!name) { return HttpResponse.badRequest(new MissingParamError('name')) }
      if (!email) { return HttpResponse.badRequest(new MissingParamError('email')) }
      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      }
      if (!password) { return HttpResponse.badRequest(new MissingParamError('password')) }
      const user = await this.createUserUseCase.create({ name, email, password })
      if (!user) { return HttpResponse.conflict(new Error('Email already in use')) }
      return HttpResponse.created(user)
    } catch (error) {
      return HttpResponse.serverError()
    }
  }

  async loadAll (_httpRequest) {
    try {
      const users = await this.loadUsersUseCase.load()
      return HttpResponse.ok(users)
    } catch (error) {
      return HttpResponse.serverError()
    }
  }

  async loadById (httpRequest) {
    try {
      const { id } = httpRequest.params
      if (!id) { return HttpResponse.badRequest(new MissingParamError('id')) }
      const user = await this.loadUserByIdUseCase.load(id)
      if (!user) { return HttpResponse.notFound('User') }
      return HttpResponse.ok(user)
    } catch (error) {
      return HttpResponse.serverError()
    }
  }

  async update (httpRequest) {
    try {
      const { id } = httpRequest.params
      if (!id) { return HttpResponse.badRequest(new MissingParamError('id')) }
      const data = httpRequest.body
      if (!data || Object.keys(data).length === 0) {
        return HttpResponse.badRequest(new MissingParamError('body'))
      }
      const user = await this.updateUserUseCase.update(id, data)
      if (!user) { return HttpResponse.notFound('User') }
      return HttpResponse.ok(user)
    } catch (error) {
      return HttpResponse.serverError()
    }
  }

  async delete (httpRequest) {
    try {
      const { id } = httpRequest.params
      if (!id) { return HttpResponse.badRequest(new MissingParamError('id')) }
      const deleted = await this.deleteUserUseCase.delete(id)
      if (!deleted) { return HttpResponse.notFound('User') }
      return HttpResponse.noContent()
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
