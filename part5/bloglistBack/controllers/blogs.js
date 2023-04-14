const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })

  return response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (
    body.title === undefined ||
    body.title === '' ||
    body.url === undefined ||
    body.url === ''
  ) {
    return response.status(400).end()
  } else if (!request.token) {
    return response.status(401).end()
  }

  const user = request.user

  const initialBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  }

  const blog = new Blog(initialBlog)
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(blog._id)
  await user.save()

  response.status(201).json(savedBlog)
})


blogsRouter.delete('/:id', async (request,response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if (user.id.toString() !== blog.user.toString()) {
    return response.status(401).json({ error: 'token invalid' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})


blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
  response.status(201).json(updatedBlog)
})

module.exports = blogsRouter