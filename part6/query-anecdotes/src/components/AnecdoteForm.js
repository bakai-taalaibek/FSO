import { useMutation, useQueryClient } from 'react-query'
import { createAnecdote } from '../requests'
import NotificationContext from './NotificationContext'
import { useContext } from 'react'


const AnecdoteForm = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const queryClient = new useQueryClient()

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')

    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 }, { 
      onError: () => {
        notificationDispatch({ payload: 'anecdote must be at least 5 letters long' })
        setTimeout(() => {
          notificationDispatch({ payload: '' })
        }, 5000)}
    })
    notificationDispatch({ payload: `"${content}" has beend added` })
    setTimeout(() => {
      notificationDispatch({ payload: '' })
    }, 5000)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
