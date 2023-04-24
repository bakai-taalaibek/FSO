import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    upvoteAnecdote (state, action) {
      const returnedAnecdote = action.payload
      return state.map(anecdote => anecdote.id === returnedAnecdote.id ? returnedAnecdote : anecdote)  
    },
    appendAnecdote (state, action) { 
      state.push(action.payload)
    },
    setAnecdotes (state, action) {
      return action.payload
    }
  }
})

export const { upvoteAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = (content) => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll(content)
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const anecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(anecdote))
  }
}

export const votingForAnecdote = (oldAnecdote) => {
  return async (dispatch) => {
    const newAnecdote = {...oldAnecdote, votes: oldAnecdote.votes + 1}
    const returnedAnecdote = await anecdoteService.update(newAnecdote)
    dispatch(upvoteAnecdote(returnedAnecdote))
  }
}

export default anecdoteSlice.reducer