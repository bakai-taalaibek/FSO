const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialBlogs = [
    {
        title: 'Barcelona',
        author: 'Xavi',
        url: 'www.barcelona.es',
        likes: 5,
    },
    {
        title: 'Juventus',
        author: 'Allegri',
        url: 'www.juventus.it',
        likes: 6,
    }
]

const blogsForPost = [
    {
        title: 'Arsenal',
        author: 'Arteta',
        url: 'www.arsenal.gov.uk',
        likes: 7,
    },
    {
        title: 'Napoli',
        author: 'Spaletti',
        url: 'www.napoli.it',
        likes: 2,
    }  
]

const initialUsers = [
    {
        username: 'root',
        name: 'Guardiola',
        passwordHash: '123'
    },
    {
        username: 'Max',
        name: 'Allegri',
        passwordHash: '456'
    }
]

const token = async () => {
    const user = await User.findOne({})

    const userForToken = {
      username: 'user.username',
      id: user._id,
    }

    return jwt.sign(userForToken, process.env.SECRET)
}

module.exports = {
    initialBlogs,
    blogsForPost,
    initialUsers,
    token
}