import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog/> component', () => {
  const blog = {
    title: 'Another brick in the wall',
    author: 'Depeche mode',
    url: 'depeche.com',
    likes: 1,
    user: {
      username: 'Jose'
    }
  }

  const user = {
    username: 'Mourinho',
    user: 'Jose'
  }

  let container
  const mockHandler = jest.fn()
  const siteUser = userEvent.setup()

  beforeEach(() => {
    container = render(<Blog blog={blog} user={user} updateLikes={mockHandler}/>).container
  })

  test('initially renders title and author', () => {
    const element = screen.getByText('Another brick in the wall - Depeche mode')
    expect(element).toBeDefined()
  })

  test('initially doesn\'t render url and likes', () => {
    const span = container.querySelector('.blogAdditionalInfo')
    expect(span).toHaveStyle('display: none')
  })

  test('after "view" button is pressed shows url and likes', async () => {
    const button = screen.getByText('view')
    await siteUser.click(button)

    const span = container.querySelector('.blogAdditionalInfo')
    expect(span).not.toHaveStyle('display: none')
  })

  test('registers "like" button presses correctly', async () => {
    const button = screen.getByText('like')
    await siteUser.click(button)
    await siteUser.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
