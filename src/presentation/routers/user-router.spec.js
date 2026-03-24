const UserRouter = require('./user-router')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const { ServerError, NotFoundError } = require('../errors')

const makeCreateUserUseCase = () => {
  class CreateUserUseCaseSpy {
    async create (userData) {
      this.userData = userData
      return this.user
    }
  }
  const spy = new CreateUserUseCaseSpy()
  spy.user = { _id: 'any_id', name: 'any_name', email: 'valid_email@mail.com' }
  return spy
}

const makeLoadUsersUseCase = () => {
  class LoadUsersUseCaseSpy {
    async load () {
      return this.users
    }
  }
  const spy = new LoadUsersUseCaseSpy()
  spy.users = [{ _id: 'any_id', name: 'any_name', email: 'any@mail.com' }]
  return spy
}

const makeLoadUserByIdUseCase = () => {
  class LoadUserByIdUseCaseSpy {
    async load (userId) {
      this.userId = userId
      return this.user
    }
  }
  const spy = new LoadUserByIdUseCaseSpy()
  spy.user = { _id: 'any_id', name: 'any_name', email: 'any@mail.com' }
  return spy
}

const makeUpdateUserUseCase = () => {
  class UpdateUserUseCaseSpy {
    async update (userId, data) {
      this.userId = userId
      this.data = data
      return this.user
    }
  }
  const spy = new UpdateUserUseCaseSpy()
  spy.user = { _id: 'any_id', name: 'updated_name', email: 'any@mail.com' }
  return spy
}

const makeDeleteUserUseCase = () => {
  class DeleteUserUseCaseSpy {
    async delete (userId) {
      this.userId = userId
      return this.deleted
    }
  }
  const spy = new DeleteUserUseCaseSpy()
  spy.deleted = true
  return spy
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }
  const spy = new EmailValidatorSpy()
  spy.isEmailValid = true
  return spy
}

const makeSut = () => {
  const createUserUseCaseSpy = makeCreateUserUseCase()
  const loadUsersUseCaseSpy = makeLoadUsersUseCase()
  const loadUserByIdUseCaseSpy = makeLoadUserByIdUseCase()
  const updateUserUseCaseSpy = makeUpdateUserUseCase()
  const deleteUserUseCaseSpy = makeDeleteUserUseCase()
  const emailValidatorSpy = makeEmailValidator()
  const sut = new UserRouter({
    createUserUseCase: createUserUseCaseSpy,
    loadUsersUseCase: loadUsersUseCaseSpy,
    loadUserByIdUseCase: loadUserByIdUseCaseSpy,
    updateUserUseCase: updateUserUseCaseSpy,
    deleteUserUseCase: deleteUserUseCaseSpy,
    emailValidator: emailValidatorSpy
  })
  return {
    sut,
    createUserUseCaseSpy,
    loadUsersUseCaseSpy,
    loadUserByIdUseCaseSpy,
    updateUserUseCaseSpy,
    deleteUserUseCaseSpy,
    emailValidatorSpy
  }
}

describe('User Router', () => {
  describe('create()', () => {
    test('Should return 400 if no name is provided', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.create({ body: { email: 'any@mail.com', password: 'any_pass' } })
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body.error).toBe(new MissingParamError('name').message)
    })

    test('Should return 400 if no email is provided', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.create({ body: { name: 'any_name', password: 'any_pass' } })
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body.error).toBe(new MissingParamError('email').message)
    })

    test('Should return 400 if an invalid email is provided', async () => {
      const { sut, emailValidatorSpy } = makeSut()
      emailValidatorSpy.isEmailValid = false
      const httpResponse = await sut.create({ body: { name: 'any_name', email: 'invalid', password: 'any_pass' } })
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body.error).toBe(new InvalidParamError('email').message)
    })

    test('Should return 400 if no password is provided', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.create({ body: { name: 'any_name', email: 'any@mail.com' } })
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body.error).toBe(new MissingParamError('password').message)
    })

    test('Should return 409 if email is already in use', async () => {
      const { sut, createUserUseCaseSpy } = makeSut()
      createUserUseCaseSpy.user = null
      const httpResponse = await sut.create({ body: { name: 'any_name', email: 'dup@mail.com', password: 'any_pass' } })
      expect(httpResponse.statusCode).toBe(409)
    })

    test('Should return 201 when user is created successfully', async () => {
      const { sut, createUserUseCaseSpy } = makeSut()
      const httpResponse = await sut.create({ body: { name: 'any_name', email: 'valid@mail.com', password: 'any_pass' } })
      expect(httpResponse.statusCode).toBe(201)
      expect(httpResponse.body).toEqual(createUserUseCaseSpy.user)
    })

    test('Should call CreateUserUseCase with correct params', async () => {
      const { sut, createUserUseCaseSpy } = makeSut()
      await sut.create({ body: { name: 'any_name', email: 'valid@mail.com', password: 'any_pass' } })
      expect(createUserUseCaseSpy.userData.name).toBe('any_name')
      expect(createUserUseCaseSpy.userData.email).toBe('valid@mail.com')
      expect(createUserUseCaseSpy.userData.password).toBe('any_pass')
    })

    test('Should return 500 if CreateUserUseCase throws', async () => {
      const { sut, createUserUseCaseSpy } = makeSut()
      createUserUseCaseSpy.create = async () => { throw new Error() }
      const httpResponse = await sut.create({ body: { name: 'any_name', email: 'valid@mail.com', password: 'any_pass' } })
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new ServerError().message)
    })
  })

  describe('loadAll()', () => {
    test('Should return 200 with list of users', async () => {
      const { sut, loadUsersUseCaseSpy } = makeSut()
      const httpResponse = await sut.loadAll({})
      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body).toEqual(loadUsersUseCaseSpy.users)
    })

    test('Should return 200 with empty list when no users exist', async () => {
      const { sut, loadUsersUseCaseSpy } = makeSut()
      loadUsersUseCaseSpy.users = []
      const httpResponse = await sut.loadAll({})
      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body).toEqual([])
    })

    test('Should return 500 if LoadUsersUseCase throws', async () => {
      const { sut, loadUsersUseCaseSpy } = makeSut()
      loadUsersUseCaseSpy.load = async () => { throw new Error() }
      const httpResponse = await sut.loadAll({})
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new ServerError().message)
    })
  })

  describe('loadById()', () => {
    test('Should return 400 if no id is provided', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.loadById({ params: {} })
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body.error).toBe(new MissingParamError('id').message)
    })

    test('Should return 404 if user is not found', async () => {
      const { sut, loadUserByIdUseCaseSpy } = makeSut()
      loadUserByIdUseCaseSpy.user = null
      const httpResponse = await sut.loadById({ params: { id: 'nonexistent_id' } })
      expect(httpResponse.statusCode).toBe(404)
      expect(httpResponse.body.error).toBe(new NotFoundError('User').message)
    })

    test('Should return 200 when user is found', async () => {
      const { sut, loadUserByIdUseCaseSpy } = makeSut()
      const httpResponse = await sut.loadById({ params: { id: 'any_id' } })
      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body).toEqual(loadUserByIdUseCaseSpy.user)
    })

    test('Should call LoadUserByIdUseCase with correct id', async () => {
      const { sut, loadUserByIdUseCaseSpy } = makeSut()
      await sut.loadById({ params: { id: 'any_id' } })
      expect(loadUserByIdUseCaseSpy.userId).toBe('any_id')
    })

    test('Should return 500 if LoadUserByIdUseCase throws', async () => {
      const { sut, loadUserByIdUseCaseSpy } = makeSut()
      loadUserByIdUseCaseSpy.load = async () => { throw new Error() }
      const httpResponse = await sut.loadById({ params: { id: 'any_id' } })
      expect(httpResponse.statusCode).toBe(500)
    })
  })

  describe('update()', () => {
    test('Should return 400 if no id is provided', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.update({ params: {}, body: { name: 'new_name' } })
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body.error).toBe(new MissingParamError('id').message)
    })

    test('Should return 400 if body is empty', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.update({ params: { id: 'any_id' }, body: {} })
      expect(httpResponse.statusCode).toBe(400)
    })

    test('Should return 404 if user is not found', async () => {
      const { sut, updateUserUseCaseSpy } = makeSut()
      updateUserUseCaseSpy.user = null
      const httpResponse = await sut.update({ params: { id: 'nonexistent_id' }, body: { name: 'new_name' } })
      expect(httpResponse.statusCode).toBe(404)
    })

    test('Should return 200 when user is updated', async () => {
      const { sut, updateUserUseCaseSpy } = makeSut()
      const httpResponse = await sut.update({ params: { id: 'any_id' }, body: { name: 'new_name' } })
      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body).toEqual(updateUserUseCaseSpy.user)
    })

    test('Should call UpdateUserUseCase with correct values', async () => {
      const { sut, updateUserUseCaseSpy } = makeSut()
      await sut.update({ params: { id: 'any_id' }, body: { name: 'new_name' } })
      expect(updateUserUseCaseSpy.userId).toBe('any_id')
      expect(updateUserUseCaseSpy.data).toEqual({ name: 'new_name' })
    })
  })

  describe('delete()', () => {
    test('Should return 400 if no id is provided', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.delete({ params: {} })
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body.error).toBe(new MissingParamError('id').message)
    })

    test('Should return 404 if user is not found', async () => {
      const { sut, deleteUserUseCaseSpy } = makeSut()
      deleteUserUseCaseSpy.deleted = false
      const httpResponse = await sut.delete({ params: { id: 'nonexistent_id' } })
      expect(httpResponse.statusCode).toBe(404)
    })

    test('Should return 204 when user is deleted', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.delete({ params: { id: 'any_id' } })
      expect(httpResponse.statusCode).toBe(204)
      expect(httpResponse.body).toBeNull()
    })

    test('Should call DeleteUserUseCase with correct id', async () => {
      const { sut, deleteUserUseCaseSpy } = makeSut()
      await sut.delete({ params: { id: 'any_id' } })
      expect(deleteUserUseCaseSpy.userId).toBe('any_id')
    })

    test('Should return 500 if DeleteUserUseCase throws', async () => {
      const { sut, deleteUserUseCaseSpy } = makeSut()
      deleteUserUseCaseSpy.delete = async () => { throw new Error() }
      const httpResponse = await sut.delete({ params: { id: 'any_id' } })
      expect(httpResponse.statusCode).toBe(500)
    })
  })
})
