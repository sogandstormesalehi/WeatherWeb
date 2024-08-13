import React, { useState, useEffect } from 'react';
import './App.css';
import { FaCloudSun, FaCloudRain, FaSnowflake, FaSmog, FaCloud, FaSun, FaExclamationTriangle } from 'react-icons/fa';

function App() {
  const apiKey = '7f8c32af060d3d85c32d76b904725d0b';
  const [weatherData, setWeatherData] = useState({});
  const [city, setCity] = useState('');
  const [error, setError] = useState(false);
  const [defaultCities, setDefaultCities] = useState([
    { name: 'Paris', data: null },
    { name: 'Lausanne', data: null },
    { name: 'Chicago', data: null },
    { name: 'Munich', data: null },
  ]);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    defaultCities.forEach((city, index) => {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=imperial&APPID=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
          const updatedCities = [...defaultCities];
          updatedCities[index].data = data;
          setDefaultCities(updatedCities);
        });
    });
  }, []);

  const getWeatherIcon = (main) => {
    switch (main) {
      case 'Clouds':
        return <FaCloud />;
      case 'Rain':
        return <FaCloudRain />;
      case 'Snow':
        return <FaSnowflake />;
      case 'Clear':
        return <FaSun />;
      case 'Haze':
      case 'Smoke':
      case 'Mist':
        return <FaSmog />;
      default:
        return <FaCloudSun />;
    }
  };

  const getWeather = (event) => {
    if (event.key === 'Enter') {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.cod === 200) {
            setWeatherData(data);
            setCity('');
            setError(false);

            const newHistory = [data.name, ...searchHistory];
            if (newHistory.length > 5) {
              newHistory.pop(); // Remove the oldest entry if history exceeds 5 items
            }
            setSearchHistory(newHistory);
          } else {
            setError(true);
          }
        })
        .catch(() => setError(true));
    }
  };

  const handleCityClick = (cityName) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&APPID=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === 200) {
          setWeatherData(data);
          setError(false);
        } else {
          setError(true);
        }
      });
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Default Cities</h2>
        <ul>
          {defaultCities.map((city, index) => (
            <li key={index} onClick={() => handleCityClick(city.name)}>
              <p>{city.name}</p>
              {city.data && (
                <div>
                  <p>{getWeatherIcon(city.data.weather[0].main)} {Math.round(city.data.main.temp)}°F</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <h1 className="title">Weather Forecast</h1>
        <input
          className="input"
          placeholder="Enter City..."
          onChange={(e) => setCity(e.target.value)}
          value={city}
          onKeyPress={getWeather}
        />
        {error ? (
          <div className="error-message">
            <FaExclamationTriangle />
            <p>City not found. Please try again.</p>
          </div>
        ) : typeof weatherData.main !== 'undefined' ? (
          <div className="weather-data">
            <h2>{weatherData.name}</h2>
            <h3>{Math.round(weatherData.main.temp)}°F</h3>
            <p>{getWeatherIcon(weatherData.weather[0].main)} {weatherData.weather[0].main}</p>
          </div>
        ) : (
          <div className="welcome-message">
            <p>Welcome to the Weather Forecast! Type a city name and press Enter!</p>
          </div>
        )}
      </div>
      <div className="search-history">
        <h2>Search History</h2>
        <ul>
          {searchHistory.map((cityName, index) => (
            <li key={index} onClick={() => handleCityClick(cityName)}>
              <p>{cityName}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
