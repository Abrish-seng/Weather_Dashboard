import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import CurrentWeather from '../CurrentWeather/CurrentWeather';
import WeatherForecast from '../WeatherForcast/WeatherForcast';
import WeatherCharts from '../WeatherCharts/WeatherCharts';
import WeatherNavbar from '../Navbar/Navbar';
import './WeatherDashboard.css';

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({
    lat: 40.7128,
    lon: -74.0060,
    name: 'New York'
  });

  // OpenWeatherMap API configuration
  const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  const buildUrl = (path, params) => {
    const searchParams = new URLSearchParams({ ...params, appid: API_KEY, units: 'metric' });
    return `${BASE_URL}${path}?${searchParams.toString()}`;
  };

  const fetchWeatherData = async (lat, lon) => {
    if (!API_KEY) {
      setError('Missing OpenWeather API key. Set REACT_APP_OPENWEATHER_API_KEY in a .env file and restart the dev server.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch current and forecast concurrently
      const currentPromise = axios.get(buildUrl('/weather', { lat, lon }));
      const forecastPromise = axios.get(buildUrl('/forecast', { lat, lon }));

      const [currentResult, forecastResult] = await Promise.allSettled([currentPromise, forecastPromise]);

      if (currentResult.status === 'fulfilled') {
        setWeatherData(currentResult.value.data);
      } else {
        const msg = currentResult.reason?.response?.data?.message || currentResult.reason?.message || 'Failed to fetch current weather.';
        throw new Error(msg);
      }

      if (forecastResult.status === 'fulfilled') {
        setForecastData(forecastResult.value.data);
      } else {
        // If forecast fails, still show current weather
        const msg = forecastResult.reason?.response?.data?.message || forecastResult.reason?.message || 'Failed to fetch forecast.';
        console.warn('Forecast error:', msg);
      }

      // Fetch historical in background; ignore failures (One Call Timemachine may require paid plan)
      (async () => {
        try {
          const historicalPromises = [];
          for (let i = 1; i <= 5; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const timestamp = Math.floor(date.getTime() / 1000);
            historicalPromises.push(
              axios.get(buildUrl('/onecall/timemachine', { lat, lon, dt: timestamp }))
            );
          }
          const results = await Promise.allSettled(historicalPromises);
          const fulfilled = results.filter(r => r.status === 'fulfilled').map(r => r.value.data);
          if (fulfilled.length > 0) {
            setHistoricalData(fulfilled);
          }
        } catch (histErr) {
          console.warn('Historical data fetch skipped:', histErr?.message || histErr);
        }
      })();

    } catch (err) {
      const msg = typeof err?.message === 'string' ? err.message : 'Failed to fetch weather data.';
      setError(`Failed to fetch weather data: ${msg}`);
      console.error('Weather API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(location.lat, location.lon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.lat, location.lon]);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  if (loading) {
    return (
      <div className="weather-dashboard loading">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="loading-spinner"
        >
          <div className="spinner"></div>
          <p>Loading weather data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="weather-dashboard">
      <WeatherNavbar 
        onLocationChange={handleLocationChange}
        currentLocation={location}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="dashboard-header"
      >
        <h1>Weather Dashboard</h1>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="error-message"
        >
          {error}
        </motion.div>
      )}

      {weatherData && (
        <div className="dashboard-content">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="current-weather-section"
          >
            <CurrentWeather data={weatherData} location={location} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="forecast-section"
          >
            <WeatherForecast data={forecastData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="charts-section"
          >
            <WeatherCharts 
              currentData={weatherData}
              forecastData={forecastData}
              historicalData={historicalData}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;