import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { getAnecdotes, incrementVoting } from './requests'
import NotificationContext from './components/NotificationContext'
import { useContext } from 'react'

const App = () => {
  const queryClient = useQueryClient()
  const [notification, notificationDispatch] = useContext(NotificationContext)
 
  const result = useQuery(
    'anecdotes',getAnecdotes
  )

  const votingMutation = useMutation(incrementVoting, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    }
  })

  if (result.isLoading) {
    return <div>loading...</div>
  } else if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data.data

  const handleVote = (anecdote) => {
    const newAnecdote = {...anecdote, votes: anecdote.votes + 1}
    votingMutation.mutate(newAnecdote)
    notificationDispatch({ payload: `you voted for "${newAnecdote.content}"` })
    setTimeout(() => {
      notificationDispatch('')
    }, 5000)
  }

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
