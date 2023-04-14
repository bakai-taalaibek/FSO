const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const bcrypt = require('bcrypt')

const User = require('../models/user')

describe('tests for user authentification: #b', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    
    const passwordHash = await bcrypt.hash('pass', 10)
    const user = new User({ username: 'Abramovich', name: 'Roman', passwordHash })

    await user.save()
  }, 50000)


  test('creating a new user #b1', async () => {
    const usersAtStart = await api.get('/api/users')
    
    const newUser = {
      username: 'Florentino',
      name: 'Peres',
      password: 'hala'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const usersAtEnd = await api.get('/api/users')
    expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length + 1)

    const names = usersAtEnd.body.map(user => user.name)
    expect(names).toContain(newUser.name)
  }, 50000)


  test('username and password validated correctly #b2', async () => {
    const usersAtStart = await api.get('/api/users')

    const userWithoutUsername = {
        name: 'Spaletti',
        password: 'napoli'
    }
    const userWithShortUsername = {
        username: 'Zi',
        name: 'Zidane',
        password: 'unemployment'
    }
    const userWithSimilarUsername = {
        username: 'Abramovich',
        name: 'fashion',
        password: 'shop'
    }
    const userWithoutPasswod = {
        username: 'Poch',
        name: 'Pochetino',
    }
    const userWithShortPassword = {
        username: 'Slut',
        name: 'Slutzky',
        password: 'ru'
    }

    await api
      .post('/api/users')
      .send(userWithoutUsername)
      .expect(400)
    await api
      .post('/api/users')
      .send(userWithShortUsername)
      .expect(400)
    await api
      .post('/api/users')
      .send(userWithSimilarUsername)
      .expect(400)
    await api
      .post('/api/users')
      .send(userWithoutPasswod)
      .expect(400)
    await api
      .post('/api/users')
      .send(userWithShortPassword)
      .expect(400)

    const usersAtEnd = await api.get('/api/users')
    expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length)
  }, 50000)
})


afterAll(async () => {
  await mongoose.connection.close()
})