import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import './LocationSearch.css';

const LocationSearch = ({ onLocationChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Predefined popular cities
  const popularCities = [
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { name: 'Paris', lat: 48.8566, lon: 2.3522 },
    { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
    { name: 'Beijing', lat: 39.9042, lon: 116.4074 },
    { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
    { name: 'São Paulo', lat: -23.5505, lon: -46.6333 },
    { name: 'Cairo', lat: 30.0444, lon: 31.2357 }
  ];

  const handleSearch = async (query) => {
    setSearchTerm(query);
    
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Filter popular cities based on search term
      const filtered = popularCities.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setSuggestions(filtered.slice(0, 5));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    onLocationChange(location);
    setSearchTerm(location.name);
    setSuggestions([]);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding would be needed here to get city name
          // For now, we'll use coordinates
          onLocationChange({
            lat: latitude,
            lon: longitude,
            name: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
          });
          setSearchTerm(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          setIsLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLoading(false);
        }
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="location-search"
    >
      <div className="search-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for a city..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          {isLoading && <div className="search-spinner"></div>}
        </div>
        
        <button
          onClick={handleCurrentLocation}
          className="current-location-btn"
          disabled={isLoading}
        >
          <FaMapMarkerAlt />
          <span>My Location</span>
        </button>
      </div>

      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="suggestions-dropdown"
        >
          {suggestions.map((city, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="suggestion-item"
              onClick={() => handleLocationSelect(city)}
            >
              <FaMapMarkerAlt className="suggestion-icon" />
              <span>{city.name}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="popular-cities">
        <h4>Popular Cities</h4>
        <div className="cities-grid">
          {popularCities.slice(0, 6).map((city, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="city-chip"
              onClick={() => handleLocationSelect(city)}
            >
              {city.name}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LocationSearch;