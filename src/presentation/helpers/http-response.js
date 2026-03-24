const { UnauthorizedError, ServerError, NotFoundError } = require('../errors')

module.exports = class HttpResponse {
  static ok (body) {
    return { statusCode: 200, body }
  }

  static created (body) {
    return { statusCode: 201, body }
  }

  static noContent () {
    return { statusCode: 204, body: null }
  }

  static badRequest (error) {
    return {
      statusCode: 400,
      body: { error: error.message }
    }
  }

  static unauthorizedError () {
    return {
      statusCode: 401,
      body: { error: new UnauthorizedError().message }
    }
  }

  static notFound (resource) {
    return {
      statusCode: 404,
      body: { error: new NotFoundError(resource).message }
    }
  }

  static conflict (error) {
    return {
      statusCode: 409,
      body: { error: error.message }
    }
  }

  static serverError () {
    return {
      statusCode: 500,
      body: { error: new ServerError().message }
    }
  }
}
