import { useDispatch } from 'react-redux'
import { filterAction } from '../reducers/filterReducer'


const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    const filterInput = event.target.value
    dispatch(filterAction(filterInput))
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}


export default Filter