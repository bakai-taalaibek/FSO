const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')


beforeEach(async () => {
  await Blog.deleteMany({})

  const user = await User.findOne({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)

    blogObject.user = user._id
        await blogObject.save()
  }
}, 50000)


describe('initial state of blogs #aa', () => {
  test('backend returns correct number of blogs  #aa1', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  }, 50000)


  test('unique identifier is correctly named "id" #aa2', async () => {
    const response = await api.get('/api/blogs')
  
    for (let blog of response.body) {
      expect(blog.id).toBeDefined()
    }
  }, 50000)
})


describe('test blog additions #ab', () => {
  test('backend successfully saves new blogs #ab1', async () => {
    for (let blog of helper.blogsForPost) {
      
      const token = await helper.token()

      await api
        .post('/api/blogs')
        .send(blog)
        .set({ 'Authorization': `Bearer ${token}` })
        .expect(201)
        .expect('Content-Type', /application\/json/)
    }
  
    const blogsAtEnd = await api.get('/api/blogs')
    console.log(blogsAtEnd.body)
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length + helper.blogsForPost.length)
  
    const titles = blogsAtEnd.body.map(blog => blog.title)
    expect(titles).toContain(helper.blogsForPost[0].title)
  }, 50000)


  test('backend rejest post attempt without token #ab2', async () => {
    const newBlog = {
      title: 'Liverpool',
      author: 'Klopp',
      url: 'www.liverpool.gov.uk',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length)
  }, 50000)


  test('a blog record is created with 0 likes if likes property is missing #ab3', async () => {
    const newBlog = {
      title: 'Liverpool',
      author: 'Klopp',
      url: 'www.liverpool.gov.uk',
    }

    const token = await helper.token()

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ 'Authorization': `Bearer ${token}` })
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    expect(response.body.likes === 0)
  }, 50000)
  
  
  test('returns status code 400 if title is missing #ab4', async () => {
    const blogWithoutTitle = {
      author: 'Conte',
      url: 'www.conte.it',
      likes: 5
    }
  
    await api
      .post('/api/blogs')
      .send(blogWithoutTitle)
      .expect(400)
  
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length)
  }, 50000)
  
  
  test('returns status code 400 if url is missing #ab5', async () => {
    const blogWithoutUrl = {
      title: 'Bayern',
      author: 'Tuchel',
      likes: 1
    }
  
    await api
      .post('/api/blogs')
      .send(blogWithoutUrl)
      .expect(400)
  
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length)
  }, 50000)
})


describe('test blog updates #ac', () => {
  test('successfully delete a post #ac1', async () => {
    const blogs = await Blog.find({})
    const blogToDelete = blogs[0]
  
    const token = await helper.token()

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ 'Authorization': `Bearer ${token}` })
      .expect(204)
  
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length - 1)  
  
    const titles = blogsAtEnd.body.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.titles)
  }, 50000)
  
  
  test('successfully updated information about a blog #ac2', async () => {
    const blogsAtBeginning = await api.get('/api/blogs')
    const initialBlog = blogsAtBeginning.body[0]
  
    const newLikes = initialBlog.likes + 5
  
    const newBlog = {
      title: initialBlog.title,
      author: initialBlog.author,
      url: initialBlog.url,
      likes: newLikes,
    }
  
    await api
      .put(`/api/blogs/${initialBlog.id}`)
      .send(newBlog)
      .expect(204)
  
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(blogsAtBeginning.body.length)
    
    const titles = blogsAtEnd.body.map(r => r.title)
    expect(titles).toContain(initialBlog.title)
  
    const updatedBlog = blogsAtEnd.body.find(r => {
      return r.title === initialBlog.title
    })
    expect(updatedBlog.likes).toEqual(newLikes)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})