const UserRouter = require('../../presentation/routers/user-router')
const CreateUserUseCase = require('../../domain/usecases/create-user-usecase')
const LoadUsersUseCase = require('../../domain/usecases/load-users-usecase')
const LoadUserByIdUseCase = require('../../domain/usecases/load-user-by-id-usecase')
const UpdateUserUseCase = require('../../domain/usecases/update-user-usecase')
const DeleteUserUseCase = require('../../domain/usecases/delete-user-usecase')
const CreateUserRepository = require('../../infra/repositories/create-user-repository')
const LoadUsersRepository = require('../../infra/repositories/load-users-repository')
const LoadUserByIdRepository = require('../../infra/repositories/load-user-by-id-repository')
const UpdateUserRepository = require('../../infra/repositories/update-user-repository')
const DeleteUserRepository = require('../../infra/repositories/delete-user-repository')
const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const Encrypter = require('../../utils/helpers/encrypter')
const EmailValidator = require('../../utils/helpers/email-validator')

module.exports = class UserRouterComposer {
  static compose () {
    const encrypter = new Encrypter()
    const emailValidator = new EmailValidator()
    const loadUserByEmailRepository = new LoadUserByEmailRepository()

    const createUserUseCase = new CreateUserUseCase({
      createUserRepository: new CreateUserRepository(),
      loadUserByEmailRepository,
      encrypter
    })
    const loadUsersUseCase = new LoadUsersUseCase({
      loadUsersRepository: new LoadUsersRepository()
    })
    const loadUserByIdUseCase = new LoadUserByIdUseCase({
      loadUserByIdRepository: new LoadUserByIdRepository()
    })
    const updateUserUseCase = new UpdateUserUseCase({
      updateUserRepository: new UpdateUserRepository()
    })
    const deleteUserUseCase = new DeleteUserUseCase({
      deleteUserRepository: new DeleteUserRepository()
    })

    return new UserRouter({
      createUserUseCase,
      loadUsersUseCase,
      loadUserByIdUseCase,
      updateUserUseCase,
      deleteUserUseCase,
      emailValidator
    })
  }
}
