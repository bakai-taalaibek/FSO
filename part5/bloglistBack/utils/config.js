require('dotenv').config()
const logger = require('./logger')

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'cypress'
  ? process.env.CYPRESS_MONGODB_URI
  : process.env.TEST_MONGODB_URI

logger.info(MONGODB_URI)

module.exports = {
  MONGODB_URI,
  PORT
}