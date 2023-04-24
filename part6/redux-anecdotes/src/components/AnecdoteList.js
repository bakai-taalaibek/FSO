import { useSelector, useDispatch } from 'react-redux'
import { votingForAnecdote } from '../reducers/anecdoteReducer'
import { displayNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, userFilter }) => {
    const filteredAnecdotes = anecdotes.filter((anecdote) => {
      return anecdote.content.toLowerCase().includes(userFilter.toLowerCase())
    })
    return filteredAnecdotes
  })

  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(votingForAnecdote(anecdote))
    dispatch(displayNotification(`You voted for "${anecdote.content}"`, 5))
  }

  return (
    <div>
      {anecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )  
}

export default AnecdoteList