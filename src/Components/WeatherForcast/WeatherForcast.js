import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';
import './WeatherForcast.css';

const WeatherForecast = ({ data }) => {
  const [selectedDay, setSelectedDay] = useState(0);

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

  // Group forecast data by day
  const groupForecastByDay = () => {
    const dailyData = {};
    
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayKey = format(date, 'yyyy-MM-dd');
      
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          date: date,
          dayName: format(date, 'EEEE'),
          items: [],
          minTemp: Infinity,
          maxTemp: -Infinity,
          avgHumidity: 0,
          avgWindSpeed: 0,
          mostFrequentWeather: null
        };
      }
      
      dailyData[dayKey].items.push(item);
      dailyData[dayKey].minTemp = Math.min(dailyData[dayKey].minTemp, item.main.temp_min);
      dailyData[dayKey].maxTemp = Math.max(dailyData[dayKey].maxTemp, item.main.temp_max);
      dailyData[dayKey].avgHumidity += item.main.humidity;
      dailyData[dayKey].avgWindSpeed += item.wind.speed;
    });

    // Calculate averages and find most frequent weather
    Object.values(dailyData).forEach(day => {
      day.avgHumidity = Math.round(day.avgHumidity / day.items.length);
      day.avgWindSpeed = Math.round(day.avgWindSpeed / day.items.length);
      
      // Find most frequent weather condition
      const weatherCounts = {};
      day.items.forEach(item => {
        const weather = item.weather[0].main;
        weatherCounts[weather] = (weatherCounts[weather] || 0) + 1;
      });
      day.mostFrequentWeather = Object.keys(weatherCounts).reduce((a, b) => 
        weatherCounts[a] > weatherCounts[b] ? a : b
      );
    });

    return Object.values(dailyData);
  };

  const dailyForecast = groupForecastByDay();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="weather-forecast"
    >
      <h2>5-Day Forecast</h2>
      
      <div className="forecast-days">
        {dailyForecast.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`forecast-day ${selectedDay === index ? 'selected' : ''}`}
            onClick={() => setSelectedDay(index)}
          >
            <div className="day-header">
              <h3>{day.dayName}</h3>
              <p className="date">{format(day.date, 'MMM d')}</p>
            </div>
            
            <div className="day-weather">
              <div className="weather-icon">
                {getWeatherIcon(day.items[Math.floor(day.items.length / 2)].weather[0].icon)}
              </div>
              <div className="temp-range">
                <span className="max-temp">{Math.round(day.maxTemp)}°</span>
                <span className="min-temp">{Math.round(day.minTemp)}°</span>
              </div>
            </div>
            
            <div className="day-details">
              <p className="weather-desc">{day.mostFrequentWeather}</p>
              <p className="humidity">💧 {day.avgHumidity}%</p>
              <p className="wind">💨 {day.avgWindSpeed} m/s</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="hourly-forecast">
        <h3>Hourly Forecast for {dailyForecast[selectedDay]?.dayName}</h3>
        <div className="hourly-scroll">
          {dailyForecast[selectedDay]?.items.map((hour, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hourly-item"
            >
              <div className="hour-time">
                {format(new Date(hour.dt * 1000), 'h a')}
              </div>
              <div className="hour-icon">
                {getWeatherIcon(hour.weather[0].icon)}
              </div>
              <div className="hour-temp">
                {Math.round(hour.main.temp)}°
              </div>
              <div className="hour-desc">
                {getWeatherDescription(hour.weather[0].description)}
              </div>
              <div className="hour-details">
                <span>💧 {hour.main.humidity}%</span>
                <span>💨 {Math.round(hour.wind.speed)} m/s</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherForecast;