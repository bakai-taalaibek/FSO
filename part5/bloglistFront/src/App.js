import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/NewBlogs'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState([])
  const [password, setPassword] = useState([])
  const [user, setUser] = useState(null)
  const [notificationAlert, setNotificationAlert] = useState(null)
  const [isError, setIsError] = useState(false)
  const blogFormRef = useRef()

  const Notification = ({ message }) => {
    if (notificationAlert && isError) {
      return (
        <div className='bg-red-100 border border-red-400 text-red-900 px-2 py-1 rounded relative'>
          <h2 >{message}</h2>
        </div>
      )
    } else if (notificationAlert && !isError) {
      return (
        <div className='bg-green-100 border border-green-400 text-green-900 px-2 py-1 rounded relative'>
          <h2 >{message}</h2>
        </div>
      )
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
    }
    catch (exeption) {
      setNotificationAlert('Wrong credentials')
      setIsError(true)
      setTimeout(() => {
        setNotificationAlert(null)
        setIsError(false)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.setItem('loggedBlogappUser', null)
    setUser(null)
    // blogSerive.setToken(null)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const response = await blogService.create(blogObject)
      const createdBlogTitle = response.title

      const blogs = await blogService.getAll()
      setBlogs(blogs)

      setNotificationAlert(`a new blog '${createdBlogTitle}' added`)
      setTimeout(() => {
        setNotificationAlert(null)
      }, 5000)
    }

    catch (exception) {
      setNotificationAlert('Failed to create a blog')
      setIsError(true)
      setTimeout(() => {
        setNotificationAlert(null)
        setIsError(false)
      }, 5000)
    }
  }

  const updateLikes = async (blogObject, id) => {
    try {
      const response = await blogService.update(blogObject, id)
      const updatedBlogTitle = response.title

      const blogs = await blogService.getAll()
      setBlogs(blogs)

      setNotificationAlert(`the likes for '${updatedBlogTitle}' have been updated`)
      setTimeout(() => {
        setNotificationAlert(null)
      }, 5000)
    }

    catch (exception) {
      setNotificationAlert('Failed to update blog\'s likes')
      setIsError(true)
      setTimeout(() => {
        setNotificationAlert(null)
        setIsError(false)
      }, 5000)
    }
  }

  const removeBlog = async (blog) => {
    try {
      await blogService.remove(blog.id)

      const blogs = await blogService.getAll()
      setBlogs(blogs)

      setNotificationAlert(`'${blog.title}' has been removed`)
      setTimeout(() => {
        setNotificationAlert(null)
      }, 5000)
    }

    catch (exception) {
      setNotificationAlert('Failed to remove blog')
      setIsError(true)
      setTimeout(() => {
        setNotificationAlert(null)
        setIsError(false)
      }, 5000)
    }
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON && loggedUserJSON !== 'null') {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  if (user === null) {
    return (
      <div id='superid' className='ml-1 font-serif text-slate-800'>
        <Notification message={notificationAlert} />
        <h2 >
          log in application
        </h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input className='st-input'
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input className='st-input'
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button className='st-button' type='submit'>login</button>
        </form>
      </div>
    )
  }
  return (
    <div className='ml-1 font-serif text-slate-800'>
      <div>
        <h2 className='font-semibold'>blogs</h2>
        <Notification message={notificationAlert} />
        <span>{user.username} is logged in </span>
        <button className='st-button' onClick={handleLogout}>logout</button>
        <br/>
        <Togglable label='new blog' ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        {blogs
          .sort((a, b) => (a.likes > b.likes) ? -1 : 1)
          .map(blog =>
            <Blog key={blog.id}
              user={user}
              blog={blog}
              updateLikes={updateLikes}
              removeBlog={removeBlog}
            />
          )}
      </div>
    </div>
  )
}

export default App