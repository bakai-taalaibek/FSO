import { useState, useEffect } from 'react'
import personServices from './services/persons'
import './index.css'

const Filter = (props) => {
  return (
    <form>
      filter shown with <input value={props.value} onChange={props.onChange}/>
    </form>
  )
}

const Persons = (props) => {
  return (
    <form > 
      {props.name} {props.number} 
      <button type="submit" onClick={props.onClick}>delete</button> 
      <b/>     
    </form> )
}

const PersonForm = (props) => {
  return (
    <form>    
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange}/>
      </div>
      <div>
        number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
      </div>
      <div>
        <button type="submit" onClick={props.addPerson}>add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showFiltered, setShowFiltered] = useState(persons)
  const [newFilter, setNewFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)  
  const [notificationStatus, setNotificationStatus] = useState("")

  useEffect(() => {
    const promise = personServices.getAll()
    promise.then(response => {setPersons(response.data)});
    promise.then(response => {setShowFiltered(response.data)});    
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
    setShowFiltered(persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase())))
  }
  
  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {  
      if (window.confirm(`${newName} was already adden to the phonebook, do you want to change number`) === true) {
        let id = '';
        let foundPerson = {};
        persons.find(person => {
          if (person.name === newName) {
            foundPerson = person
            id = person.id
          }
        })
        const newPerson = {...foundPerson, number: newNumber}
        personServices.updateNumber(id, newPerson)
          .then(response => {
            setPersons(persons.map(p => p.id !== id ? p : response.data))        
            setShowFiltered(persons.map(p => p.id !== id ? p : response.data))
            setNewName('')
            setNewNumber('')
            setNotificationStatus("success")
            setNotificationMessage(`${response.data.name}'s number has been updated`)
            setTimeout(() => {setNotificationMessage(null)}, 5000)   
            return alert("the number has been changed")})
          .catch(error => {
            setNotificationStatus("failure")
            setNotificationMessage(`${newPerson.name} has already been deleted from the phonebook`)            
            setTimeout(() => {setNotificationMessage(null)}, 5000)
            personServices.getAll().then(response => {setShowFiltered(response.data)});    
            setNewName('')
            setNewNumber('')
          })
      }
      else {
        return alert(`${newName} was left unchanged`)  
      }          
    }
    else {
      const newObj = {
        name: newName,
        number: newNumber, 
      }
      setNewName('')
      setNewNumber('')
      personServices.create(newObj).then(response => {setPersons(persons.concat(response.data))
      setShowFiltered(persons.concat(newObj))    
      setNewFilter('')
      setNotificationStatus("success")
      setNotificationMessage(`${response.data.name} has been added to the phonebook`)
      setTimeout(() => {setNotificationMessage(null)}, 5000)
      })
    }    
  }

  const Notification = ({status, message}) => {
    if (message === null) {
      return null
    }
    else if (status === "success"){
      return <p className='notification'>{message}</p>
    }
    else {
      return <p className='error'>{message}</p>
    }
    
  }

  const deletePerson = (name, id) => {
    if (window.confirm(`Delete ${name}?`) === true) {
      personServices.deletePerson(id).then(response => {setPersons(response.data)})
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification status={notificationStatus} message={notificationMessage}/> 
      <Filter value={newFilter} onChange={handleFilterChange}/>
      <h3>add a new</h3>  
      <PersonForm
        newName={newName} handleNameChange={handleNameChange} 
        newNumber={newNumber} handleNumberChange={handleNumberChange}
        addPerson={addPerson} 
      />
      <h3>Numbers</h3>
        {showFiltered.map(person => 
          <Persons 
            key={person.name} 
            name={person.name} 
            number={person.number} 
            onClick={() => deletePerson(person.name, person.id)}
          /> )}  
    </div>
  )
}

export default App