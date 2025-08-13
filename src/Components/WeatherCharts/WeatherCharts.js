import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, subDays } from 'date-fns';
import './WeatherCharts.css';

const WeatherCharts = ({ currentData, forecastData, historicalData }) => {
  const [activeChart, setActiveChart] = useState('temperature');

  const chartData = useMemo(() => {
    if (!forecastData) return [];

    // Process forecast data for charts
    const processedData = forecastData.list.map((item, index) => ({
      time: format(new Date(item.dt * 1000), 'MMM d, h a'),
      temperature: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      humidity: item.main.humidity,
      windSpeed: Math.round(item.wind.speed),
      pressure: item.main.pressure,
      description: item.weather[0].description
    }));

    return processedData;
  }, [forecastData]);

  const historicalChartData = useMemo(() => {
    if (!historicalData) return [];

    const processedHistorical = historicalData.map((dayData, index) => {
      const date = subDays(new Date(), index + 1);
      const avgTemp = dayData.data.reduce((sum, hour) => sum + hour.temp, 0) / dayData.data.length;
      const avgHumidity = dayData.data.reduce((sum, hour) => sum + hour.humidity, 0) / dayData.data.length;
      const avgWindSpeed = dayData.data.reduce((sum, hour) => sum + hour.wind_speed, 0) / dayData.data.length;

      return {
        date: format(date, 'MMM d'),
        temperature: Math.round(avgTemp),
        humidity: Math.round(avgHumidity),
        windSpeed: Math.round(avgWindSpeed)
      };
    }).reverse();

    return processedHistorical;
  }, [historicalData]);

  const weatherDistribution = useMemo(() => {
    if (!forecastData) return [];

    const weatherCounts = {};
    forecastData.list.forEach(item => {
      const weather = item.weather[0].main;
      weatherCounts[weather] = (weatherCounts[weather] || 0) + 1;
    });

    return Object.entries(weatherCounts).map(([name, value]) => ({
      name,
      value
    }));
  }, [forecastData]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const renderTemperatureChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="time" 
          stroke="#666"
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis stroke="#666" fontSize={12} />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="temperature" 
          stroke="#ff6b6b" 
          strokeWidth={3}
          dot={{ fill: '#ff6b6b', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="feelsLike" 
          stroke="#4ecdc4" 
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: '#4ecdc4', strokeWidth: 2, r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderHumidityChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="time" 
          stroke="#666"
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis stroke="#666" fontSize={12} />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="humidity" 
          stroke="#74b9ff" 
          fill="#74b9ff"
          fillOpacity={0.3}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderWindChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="time" 
          stroke="#666"
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis stroke="#666" fontSize={12} />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Bar 
          dataKey="windSpeed" 
          fill="#a29bfe"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderHistoricalChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={historicalChartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" stroke="#666" fontSize={12} />
        <YAxis stroke="#666" fontSize={12} />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="temperature" 
          stroke="#ff6b6b" 
          strokeWidth={3}
          dot={{ fill: '#ff6b6b', strokeWidth: 2, r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="humidity" 
          stroke="#74b9ff" 
          strokeWidth={2}
          dot={{ fill: '#74b9ff', strokeWidth: 2, r: 3 }}
        />
        <Line 
          type="monotone" 
          dataKey="windSpeed" 
          stroke="#a29bfe" 
          strokeWidth={2}
          dot={{ fill: '#a29bfe', strokeWidth: 2, r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderWeatherDistribution = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={weatherDistribution}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {weatherDistribution.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderCurrentStats = () => (
    <div className="current-stats">
      <div className="stat-card">
        <h3>Current Temperature</h3>
        <div className="stat-value">{Math.round(currentData.main.temp)}°C</div>
        <div className="stat-label">Feels like {Math.round(currentData.main.feels_like)}°C</div>
      </div>
      <div className="stat-card">
        <h3>Humidity</h3>
        <div className="stat-value">{currentData.main.humidity}%</div>
        <div className="stat-label">Relative humidity</div>
      </div>
      <div className="stat-card">
        <h3>Wind Speed</h3>
        <div className="stat-value">{Math.round(currentData.wind.speed)} m/s</div>
        <div className="stat-label">Current wind</div>
      </div>
      <div className="stat-card">
        <h3>Pressure</h3>
        <div className="stat-value">{currentData.main.pressure} hPa</div>
        <div className="stat-label">Atmospheric pressure</div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="weather-charts"
    >
      <h2>Weather Analytics</h2>
      
      {renderCurrentStats()}

      <div className="chart-controls">
        <button
          className={`chart-btn ${activeChart === 'temperature' ? 'active' : ''}`}
          onClick={() => setActiveChart('temperature')}
        >
          Temperature
        </button>
        <button
          className={`chart-btn ${activeChart === 'humidity' ? 'active' : ''}`}
          onClick={() => setActiveChart('humidity')}
        >
          Humidity
        </button>
        <button
          className={`chart-btn ${activeChart === 'wind' ? 'active' : ''}`}
          onClick={() => setActiveChart('wind')}
        >
          Wind Speed
        </button>
        <button
          className={`chart-btn ${activeChart === 'historical' ? 'active' : ''}`}
          onClick={() => setActiveChart('historical')}
        >
          Historical
        </button>
        <button
          className={`chart-btn ${activeChart === 'distribution' ? 'active' : ''}`}
          onClick={() => setActiveChart('distribution')}
        >
          Weather Distribution
        </button>
      </div>

      <div className="chart-container">
        {activeChart === 'temperature' && renderTemperatureChart()}
        {activeChart === 'humidity' && renderHumidityChart()}
        {activeChart === 'wind' && renderWindChart()}
        {activeChart === 'historical' && renderHistoricalChart()}
        {activeChart === 'distribution' && renderWeatherDistribution()}
      </div>
    </motion.div>
  );
};

export default WeatherCharts;