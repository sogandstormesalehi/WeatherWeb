import React, {useState} from 'react'
import './App.css'

function App() {
  const apiKey = '7f8c32af060d3d85c32d76b904725d0b'
  const [weatherData, setWeatherData] = useState([{}])
  const [city, setCity] = useState("")

  const getWeather = (event) => {
    if (event.key == "Enter") {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${apiKey}`).then(response => response.json()).then(
        data => {
          setWeatherData(data)
          setCity("")
        }
      )
    }
  }

  return (
    <div className="container" > 
      <input className = "input" 
      placeholder="Enter City..."
      onChange = {e => setCity(e.target.value)}
      value = {city}
      onKeyPress = {getWeather}
      />
      {
        typeof weatherData.main === 'undefined' ? (
          <div>
           <p>Welcome to my weather app! Type a city name and press Enter!</p> 
          </div>
        ) : (
          <div className = 'weather-data'>
            <p>{weatherData.name}</p>
            <p>{Math.round(weatherData.main.temp)}°F</p>
            <p>{weatherData.weather[0].main}</p>
          </div>
        )
      }

    </div>
  )
}

export default App