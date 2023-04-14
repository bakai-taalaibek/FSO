import { useState } from 'react'

const Blog = ({ user, blog, updateLikes, removeBlog }) => {
  const [visible, setVisible] = useState(false)
  const label = visible ? 'hide' : 'view'
  const showWhenVisible = { display: visible ? '' : 'none' }

  const handleLikes = (blog) => {
    const newObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: blog.user.id,
      likes: blog.likes + 1
    }
    updateLikes(newObject, blog.id)
  }

  const handleDelete = (blog) => {
    window.confirm(`Do you want to remove "${blog.title}"?`)
      && removeBlog(blog)
  }

  return (
    <div name='blogRecord' className='bg-sky-100 m-1 px-2 py-1 rounded-lg'>
      { blog.title } - { blog.author }
      <button onClick={() => setVisible(!visible)} className='st-button'> { label } </button><br/>
      <span style={showWhenVisible} className={'blogAdditionalInfo'}>
        { blog.url } <br/>
        { blog.likes } likes
        <button className='st-button' id='likeButton' onClick={() => handleLikes(blog)}>like</button><br/>
        { blog.user.username } <br/>
        { blog.user.username === user.username &&
          <button className='st-button' id='removeButton' onClick={() => handleDelete(blog)}>remove</button>
        }
      </span>
    </div>
  )
}

export default Blog