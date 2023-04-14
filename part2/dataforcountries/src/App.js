import {useState} from 'react'
import axios from 'axios'

const Countries = ({countries, handleClick, handleWeather}) => { 
  if (countries.length > 10) {
    return (
      <div>
        Please make you query more specific
      </div>
    )
  }
  else if (countries.length > 1) {
    return (
      countries.map(country => 
      <form key={country.name.common}>
        <>{country.name.common}</>
        <button type="button" onClick={() => handleClick(country.name.common)}>show</button>
      </form>
      )
    )
  }
  else {    
    (() => {handleWeather(countries[0].capitalInfo.latlng[0], countries[0].capitalInfo.latlng[1])})()
    return (
      countries.map(country => 
        <div key={country.name.common}>
          <h2>{country.name.common}</h2>
          <p>capital: {country.capital} </p>
          <p>area: {country.area} </p>
          <h3>languages:</h3>
          <ul>{Object.values(country.languages).map(l => {return <li key={l}>{l}</li>})}</ul>
          <img src={country.flags.png} />
        </div>         
      )
    )
    
  }
}

function App() {
  const [countryText, setCountryText] = useState('')
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)

  const handleClick = (data) => {    
    setCountryText(data)    
    setCountries(countries.filter(country => country.name.common.toLowerCase().includes(data.toLowerCase())))
  }

  const handleWeather = (lat, lng) => {
    axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`)
      .then(response => setWeather(response.data))
  }
  
  const handleCountryTextChange = (event) => {
    setCountryText(event.target.value)    
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => setCountries(response.data.filter(country => country.name.common.toLowerCase().includes(event.target.value.toLowerCase()))))
  }

  return (
    <div>
      <form>
        find countries <input value={countryText} onChange={handleCountryTextChange}/>
      </form>
        <Countries handleClick={handleClick} handleWeather={handleWeather} countries={countries}/>
        {(() => {
          if (weather !== null && countries.length === 1) {
            return (
              <div>
                <h2>Weather in {countries[0].capital} </h2>
                <p>temperature: {weather.current_weather.temperature} Celcius</p>
                <p>wind: {weather.current_weather.windspeed} m/s</p>
              </div>
            )
          } else {
            return null
          }
        })()}
    </div>
  );
}

export default App;
