if (!process.env.TOKEN_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('TOKEN_SECRET environment variable is required in production')
}

module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  tokenSecret: process.env.TOKEN_SECRET || 'secret',
  port: process.env.PORT || 5858
}
