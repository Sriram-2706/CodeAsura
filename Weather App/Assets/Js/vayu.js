const apiKey = 'YOUR-OWN-API'; // Replace with your actual API key

document.getElementById('searchButton').addEventListener('click', () => {
  const cityInput = document.getElementById('cityInput').value;
  if (cityInput) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
      .then(data => {
        const weatherInfo = document.getElementById('weatherInfo');
        const weatherCondition = data.weather[0].description;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const dateTime = new Date(data.dt * 1000).toLocaleString();

        weatherInfo.innerHTML = `
          <h2>Weather in ${data.name}</h2>
          <p>Weather Condition: ${weatherCondition}</p>
          <p>Temperature: ${temperature}?C</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${windSpeed} m/s</p>
          <p>Date and Time: ${dateTime}</p>
        `;

        // Fetch 7-day forecast data
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKey}&units=metric`)
          .then(response => response.json())
          .then(forecastData => {
            const forecastChart = document.getElementById('forecastChart');
            const dates = [];
            const temperatures = [];
            const humidities = [];
            const weatherConditions = [];

            // Extract data for the next 7 days
            forecastData.list.forEach(item => {
              const day = new Date(item.dt * 1000);
              const date = day.toLocaleDateString();
              const temperature = item.main.temp;
              const humidity = item.main.humidity;
              const weatherIcon = item.weather[0].icon; // Icon representing weather condition

              dates.push(date);
              temperatures.push(temperature);
              humidities.push(humidity);
              weatherConditions.push(weatherIcon);
            });

            // Create temperature, humidity, and weather condition charts
            new Chart(forecastChart, {
              type: 'line',
              data: {
                labels: dates,
                datasets: [
                  {
                    label: 'Temperature (?C)',
                    data: temperatures,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                  },
                  {
                    label: 'Humidity (%)',
                    data: humidities,
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                  },
                ],
              },
            });

            // Display weather condition icons for each day
            const weatherIconsContainer = document.getElementById('weatherIcons');
            weatherIconsContainer.innerHTML = '';
            weatherConditions.forEach(icon => {
              const iconUrl = `https://openweathermap.org/img/w/${icon}.png`;
              const iconImage = document.createElement('img');
              iconImage.src = iconUrl;
              weatherIconsContainer.appendChild(iconImage);
            });
          })
          .catch(error => {
            console.error('Error fetching forecast data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  }
});
