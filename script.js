'use strict';
console.log('Hello, World!');

// Make a request to a url
const params = {
  "latitude": 50.904,
  "longitude": -1.4043,
  "current": "temperature_2m"
};
const url = "https://api.open-meteo.com/v1/forecast";
const queryString = new URLSearchParams(params).toString();
console.log(queryString);
const requestUrl = `${url}?${queryString}`;
console.log(requestUrl);

const budapest_avg = 17;

fetch(requestUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    const soton_now = data.current.temperature_2m;
    console.log('SOTON', soton_now);
    const diff = soton_now - budapest_avg;
    console.log('Difference', diff);
    showTemperature(soton_now, budapest_avg, diff);
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });

  function showTemperature(soton_now, budapest_avg, diff) {
    const contentSection = document.querySelector('#content');
    var msg = `The temperature in Southampton right now is ${soton_now}°C.`
    const p1 = document.createElement('p');
    p1.textContent = msg;
    contentSection.appendChild(p1);

    if (diff < 0) {
      msg = `It is ${-diff}°C colder than the average May temperature in Budapest (${budapest_avg}°C). 🥶`;
    }
    else if (diff > 0) {
      msg = `It is ${diff}°C warmer than the average May temperature in Budapest (${budapest_avg}°C). 🥵`;
    } else {
      msg = `It is the same temperature as the average May temperature in Budapest (${budapest_avg}°C). 😐`;
    }
    const p2 = document.createElement('p');
    p2.textContent = msg;
    contentSection.appendChild(p2);
    
    console.log(msg);
  }

