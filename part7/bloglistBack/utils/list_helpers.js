const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  let sum = blogs.reduce((accumulator, blog) => {
    return accumulator + blog.likes
  }, 0)
  return sum
}

const favoriteBlog = (blogs) => {
  if (!Array.isArray(blogs)) {
    return 'Please provide an array'
  } else if (blogs.length === 0) {
    return 'No blogs were provided'
  }

  let foundBlog = blogs.reduce((previous, current) => {
    return (previous.likes > current.likes) ? previous : current
  })

  let formattedFoundBlog = ['title', 'author', 'likes'].reduce((result, key) => {
    result[key] = foundBlog[key]
    return result
  }, {})

  return(formattedFoundBlog)
}

const mostBlogs = (blogs) => {
  if (!Array.isArray(blogs)) {
    return 'Please provide an array'
  } else if (blogs.length === 0) {
    return 'No blogs were provided'
  }

  let rating = []
  for (let blog of blogs) {
    for (let entry of rating) {
      if (entry.author === blog.author) {
        entry.blogs += 1
      }
    }

    if (!rating.some(entry => entry.author === blog.author)) {
      rating.push({ author: blog.author, blogs: 1 })
    }
  }

  return rating.reduce((previous, current) => {
    return (previous.blogs > current.blogs) ? previous : current
  })
}

const mostLikes = (blogs) => {
  if (!Array.isArray(blogs)) {
    return 'Please provide an array'
  } else if (blogs.length === 0) {
    return 'No blogs were provided'
  }

  let rating = []
  for (let blog of blogs) {
    for (let entry of rating) {
      if (entry.author === blog.author) {
        entry.likes += blog.likes
      }
    }

    if (!rating.some(entry => entry.author === blog.author)) {
      rating.push({ author: blog.author, likes: blog.likes })
    }
  }

  return rating.reduce((previous, current) => {
    return (previous.likes > current.likes) ? previous : current
  })
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}