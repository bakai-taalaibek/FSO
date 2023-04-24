import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () => (
  axios.get(baseUrl).then(res => res)
)

export const createAnecdote = newNote =>  
  axios.post(baseUrl, newNote).then(res => res)

export const incrementVoting = (newAnecdote) => {
  return axios.put(`${baseUrl}/${newAnecdote.id}`, newAnecdote)
}