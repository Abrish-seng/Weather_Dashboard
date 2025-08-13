import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaCloudSun, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import './Navbar.css';

const WeatherNavbar = ({ onLocationChange, currentLocation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Popular cities for quick access
  const popularCities = [
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { name: 'Paris', lat: 48.8566, lon: 2.3522 },
    { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
    { name: 'Beijing', lat: 39.9042, lon: 116.4074 },
    { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
  ];

  const handleLocationSelect = (location) => {
    onLocationChange(location);
    setSearchTerm(location.name);
    setShowSearch(false);
    setIsOpen(false);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationChange({
            lat: latitude,
            lon: longitude,
            name: 'Current Location'
          });
          setSearchTerm('Current Location');
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
    setIsOpen(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 0) {
      setShowSearch(true);
    } else {
      setShowSearch(false);
    }
  };

  const filteredCities = popularCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.nav 
      className={`weather-navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        <motion.div 
          className="navbar-brand"
          whileHover={{ scale: 1.05 }}
        >
          <FaCloudSun className="brand-icon" />
          <span>Weather Dashboard</span>
        </motion.div>

        <div className="navbar-search">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            {showSearch && searchTerm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="search-dropdown"
              >
                {filteredCities.map((city, index) => (
                  <motion.div
                    key={index}
                    className="search-item"
                    onClick={() => handleLocationSelect(city)}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    <FaMapMarkerAlt />
                    <span>{city.name}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <div className="current-location">
            <span className="location-label">Current:</span>
            <span className="location-name">{currentLocation?.name || 'New York'}</span>
          </div>
          
          <motion.button
            className="location-btn"
            onClick={handleCurrentLocation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaMapMarkerAlt />
            <span>My Location</span>
          </motion.button>

          <div className="quick-cities">
            <span className="quick-label">Quick Cities:</span>
            <div className="city-chips">
              {popularCities.slice(0, 4).map((city, index) => (
                <motion.button
                  key={index}
                  className="city-chip"
                  onClick={() => handleLocationSelect(city)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {city.name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </motion.nav>
  );
};

export default WeatherNavbar;