const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}
 
const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      const good = state.good + 1
      const stateGood = {...state, good}
      return stateGood
    case 'OK':
      const ok = state.ok + 1
      const stateOk = {...state, ok}
      return stateOk
    case 'BAD':
      const bad = state.bad + 1
      const stateBad = {...state, bad}
      return stateBad
    case 'ZERO':      
      const stateZero = {
        good: 0,
        ok: 0,
        bad: 0
      }
      return stateZero
    default: return state
  }
  
}

export default counterReducer
