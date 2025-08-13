import React from 'react';
import { motion } from 'framer-motion';
import { WiHumidity, WiStrongWind, WiThermometer, WiBarometer } from 'react-icons/wi';
import { format } from 'date-fns';
import './CurrentWeather.css';

const CurrentWeather = ({ data, location }) => {
  const getWeatherIcon = (weatherCode) => {
    const iconMap = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️'
    };
    return iconMap[weatherCode] || '🌤️';
  };

  const getWeatherDescription = (description) => {
    return description.charAt(0).toUpperCase() + description.slice(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="current-weather"
    >
      <div className="weather-header">
        <h2>{location.name}</h2>
        <p className="current-time">
          {format(new Date(), 'EEEE, MMMM do, yyyy')}
        </p>
        <p className="current-time">
          {format(new Date(), 'h:mm a')}
        </p>
      </div>

      <div className="weather-main">
        <div className="temperature-section">
          <div className="weather-icon">
            {getWeatherIcon(data.weather[0].icon)}
          </div>
          <div className="temperature-info">
            <h1 className="temperature">
              {Math.round(data.main.temp)}°C
            </h1>
            <p className="weather-description">
              {getWeatherDescription(data.weather[0].description)}
            </p>
            <div className="temp-range">
              <span>H: {Math.round(data.main.temp_max)}°</span>
              <span>L: {Math.round(data.main.temp_min)}°</span>
            </div>
          </div>
        </div>

        <div className="weather-details">
          <div className="detail-item">
            <WiThermometer className="detail-icon" />
            <div className="detail-info">
              <span className="detail-label">Feels Like</span>
              <span className="detail-value">{Math.round(data.main.feels_like)}°C</span>
            </div>
          </div>

          <div className="detail-item">
            <WiHumidity className="detail-icon" />
            <div className="detail-info">
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{data.main.humidity}%</span>
            </div>
          </div>

          <div className="detail-item">
            <WiStrongWind className="detail-icon" />
            <div className="detail-info">
              <span className="detail-label">Wind Speed</span>
              <span className="detail-value">{Math.round(data.wind.speed)} m/s</span>
            </div>
          </div>

          <div className="detail-item">
            <WiBarometer className="detail-icon" />
            <div className="detail-info">
              <span className="detail-label">Pressure</span>
              <span className="detail-value">{data.main.pressure} hPa</span>
            </div>
          </div>

          {data.visibility && (
            <div className="detail-item">
              <span className="detail-icon">👁️</span>
              <div className="detail-info">
                <span className="detail-label">Visibility</span>
                <span className="detail-value">{(data.visibility / 1000).toFixed(1)} km</span>
              </div>
            </div>
          )}

          {data.clouds && (
            <div className="detail-item">
              <span className="detail-icon">☁️</span>
              <div className="detail-info">
                <span className="detail-label">Cloud Cover</span>
                <span className="detail-value">{data.clouds.all}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="sun-info">
        <div className="sun-item">
          <span className="sun-icon">🌅</span>
          <div className="sun-details">
            <span className="sun-label">Sunrise</span>
            <span className="sun-time">
              {format(new Date(data.sys.sunrise * 1000), 'h:mm a')}
            </span>
          </div>
        </div>
        <div className="sun-item">
          <span className="sun-icon">🌇</span>
          <div className="sun-details">
            <span className="sun-label">Sunset</span>
            <span className="sun-time">
              {format(new Date(data.sys.sunset * 1000), 'h:mm a')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentWeather;