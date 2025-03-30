'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const budapest_avg = 17;
  const CACHE_KEY = 'weatherData';
  const CACHE_LIFETIME = 60 * 60 * 1000; // 1 hour in milliseconds

  // Function to fetch weather data
  function fetchWeather(latitude, longitude) {
    const params = {
      latitude: latitude,
      longitude: longitude,
      current_weather: true
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const queryString = new URLSearchParams(params).toString();
    const requestUrl = `${url}?${queryString}`;
    console.log(requestUrl);

    fetch(requestUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        const soton_now = data.current_weather.temperature;
        console.log('Current Temperature', soton_now);

        // Cache the data with a timestamp
        const cacheData = {
          temperature: soton_now,
          timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

        const diff = soton_now - budapest_avg;
        console.log('Difference', diff);
        showTemperature(soton_now, budapest_avg, diff);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }

  // Function to display temperature information
  function showTemperature(soton_now, budapest_avg, diff) {
    const contentSection = document.querySelector('#content');
    
    if (!contentSection) {
      console.error('Content section not found!');
      return;
    }

    // Clear previous content
    console.log('Clearing content section...');
    contentSection.innerHTML = '';

    let msg = `The temperature in your location right now is ${soton_now}°C.`;
    const p1 = document.createElement('p');
    p1.textContent = msg;
    contentSection.appendChild(p1);

    if (diff < 0) {
      msg = `This is ${-diff}°C colder than the average May temperature in Budapest (${budapest_avg}°C). 🥶`;
    } else if (diff > 0) {
      msg = `This is ${diff}°C warmer than the average May temperature in Budapest (${budapest_avg}°C). 🥵`;
    } else {
      msg = `This is the same temperature as the average May temperature in Budapest (${budapest_avg}°C). 😐`;
    }
    const p2 = document.createElement('p');
    p2.textContent = msg;
    contentSection.appendChild(p2);

    console.log('Content updated successfully:', contentSection.innerHTML);
  }

  // Function to check the cache
  function getCachedWeather() {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { temperature, timestamp } = JSON.parse(cachedData);
      const now = Date.now();

      // Check if the cached data is still valid
      if (now - timestamp < CACHE_LIFETIME) {
        console.log('Using cached data');
        const diff = temperature - budapest_avg;
        showTemperature(temperature, budapest_avg, diff);
        return true;
      } else {
        console.log('Cached data expired');
        localStorage.removeItem(CACHE_KEY);
      }
    }
    return false;
  }

  // Get user's current location
  if (!getCachedWeather()) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(`User's location: Latitude ${latitude}, Longitude ${longitude}`);
          fetchWeather(latitude, longitude);
        },
        error => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location. Using default location (Southampton).');
          // Fallback to default location (Southampton)
          fetchWeather(50.904, -1.4043);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser. Using default location (Southampton).');
      // Fallback to default location (Southampton)
      fetchWeather(50.904, -1.4043);
    }
  }
});

