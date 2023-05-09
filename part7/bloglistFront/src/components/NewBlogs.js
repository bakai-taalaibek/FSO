import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState([])
  const [author, setAuthor] = useState([])
  const [url, setUrl] = useState([])
  const [likes, setLikes] = useState([])

  const handleCreate = (event) => {
    event.preventDefault()

    const newObject = {
      title,
      author,
      url,
      likes
    }
    createBlog(newObject)

    setAuthor('')
    setTitle('')
    setUrl('')
    setLikes('')
  }

  return (
    <div>
      <h2 className='font-semibold'>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title:
          <input className='st-input'
            type='text'
            value={title}
            name='Title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div >
          author:
          <input className='st-input'
            type='text'
            value={author}
            name='Author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input className='st-input'
            type='text'
            value={url}
            name='Url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <div>
          likes:
          <input className='st-input'
            type='number'
            value={likes}
            name='Likes'
            onChange={({ target }) => setLikes(target.value)}
          />
        </div>
        <button id='createButton' className='st-button' type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm