import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import NewBlogs from './NewBlogs'
import userEvent from '@testing-library/user-event'

test('<NewBlogs/> sends correct props to event handler', async () => {
  const user = userEvent.setup()
  const mockHandler = jest.fn()

  const container = render(<NewBlogs createBlog={mockHandler}/>).container

  const title = container.querySelector('input[name="Title"]')
  const author = container.querySelector('input[name="Author"]')
  const url = container.querySelector('input[name="Url"]')
  const button = screen.getByText('create')

  await user.type(title, 'Good blog')
  await user.type(author, 'Good boy')
  await user.type(url, 'good.com')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe('Good blog')
  expect(mockHandler.mock.calls[0][0].author).toBe('Good boy')
  expect(mockHandler.mock.calls[0][0].url).toBe('good.com')
})