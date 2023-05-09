const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
// const morgan = require('morgan')

// morgan.token('data', (req) => {
//   return JSON.stringify(req.body)
// })
// const requestLogger = morgan(':method :url :status - :response-time ms - :data \n ---')

const requestLogger = (request, response, next) => {
  logger.info(request.method, request.path, request.body, '\n ---')
  next()
}

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' })
  next()
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: error.message })
  }
  logger.error(error.message)
  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    console.log(decodedToken)
    request.user = await User.findById(decodedToken.id)
  }
  next()
}


module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}