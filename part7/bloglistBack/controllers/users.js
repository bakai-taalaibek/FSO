const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1 })

  return response.json(users)
})


usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (username === undefined || password === undefined) {
    return response.status(400).json({ error: 'content missing' })
  } else if (password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 letters long' })
  }

  const blogs = await Blog.find({})
  const blog = blogs[0]
  const blogId = blog ? blog._id : []

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  console.log(blogId)
  const user = new User({
    username,
    name,
    passwordHash,
    blogs: blogId
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter