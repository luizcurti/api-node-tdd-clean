const router = require('express').Router()
const fg = require('fast-glob')
const path = require('path')

module.exports = app => {
  app.use('/api', router)
  fg.sync('**/src/main/routes/**routes.js').forEach(file => require(path.resolve(file))(router))
}
