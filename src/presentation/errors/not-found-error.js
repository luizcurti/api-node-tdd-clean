module.exports = class NotFoundError extends Error {
  constructor (resource = 'Resource') {
    super(`${resource} not found`)
    this.name = 'NotFoundError'
  }
}
