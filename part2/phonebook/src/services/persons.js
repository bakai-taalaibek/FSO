import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(baseUrl)
}

const create = (newObj) => {
    return axios.post(baseUrl, newObj)
}

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const updateNumber = (id, changedPerson) => {
    return axios.put(`${baseUrl}/${id}`, changedPerson)
}

export default {getAll, create, deletePerson, updateNumber}