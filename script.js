document.addEventListener("DOMContentLoaded", () => {
    let timer;
    let milliseconds = 0;
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let running = false;
    let showMicroseconds = true;
    let laps = [];

    function updateDisplay() {
        let display = document.getElementById("display");
        let ms = milliseconds < 100 ? (milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds) : milliseconds;
        let sec = seconds < 10 ? "0" + seconds : seconds;
        let min = minutes < 10 ? "0" + minutes : minutes;
        let hr = hours < 10 ? "0" + hours : hours;
        display.textContent = showMicroseconds ? `${hr}:${min}:${sec}.${ms}` : `${hr}:${min}:${sec}`;
    }

    function startStopwatch() {
        if (!running) {
            running = true;
            timer = setInterval(() => {
                milliseconds += 1;
                if (milliseconds === 1000) {
                    milliseconds = 0;
                    seconds++;
                }
                if (seconds === 60) {
                    seconds = 0;
                    minutes++;
                }
                if (minutes === 60) {
                    minutes = 0;
                    hours++;
                }
                updateDisplay();
            }, 1);
        }
    }

    function stopStopwatch() {
        clearInterval(timer);
        running = false;
    }

    function resetStopwatch() {
        clearInterval(timer);
        running = false;
        milliseconds = 0;
        seconds = 0;
        minutes = 0;
        hours = 0;
        laps = [];
        updateDisplay();
        updateLaps();
    }

    function lapStopwatch() {
        if (running) {
            laps.push(document.getElementById("display").textContent);
            updateLaps();
        }
    }

    function updateLaps() {
        const lapsList = document.getElementById("laps-list");
        lapsList.innerHTML = '';
        laps.forEach((lap, index) => {
            const li = document.createElement("li");
            li.textContent = `Lap ${index + 1}: ${lap}`;
            lapsList.appendChild(li);
        });
    }

    function toggleMicroseconds() {
        showMicroseconds = !showMicroseconds;
        updateDisplay();
    }

    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        document.getElementById("current-time").textContent = `Current Time: ${hours}:${minutes}:${seconds}`;
    }

    function updateDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        document.getElementById("current-date").textContent = `Current Date: ${year}-${month}-${day}`;
    }

    function updateTemperature() {
        const city = document.getElementById("city").value.trim();
        if (city) {
            const apiKey = '1d517b27f4a5a7ab8b3a71ba0f15d8e0'; // Replace with your OpenWeatherMap API key
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

            console.log(`Fetching temperature for city: ${city}`); // Debugging step
            console.log(`API URL: ${url}`); // Debugging step

            document.getElementById("current-temperature").textContent = `Loading...`;
            document.getElementById("weather-icon").style.display = "none";
            document.getElementById("weather-description").textContent = '';

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log('API response:', data); // Debugging step
                    if (data.main) {
                        const temperature = data.main.temp;
                        const icon = data.weather[0].icon;
                        const description = data.weather[0].description;
                        document.getElementById("current-temperature").textContent = `Current Temperature: ${temperature}°C`;
                        document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${icon}.png`;
                        document.getElementById("weather-icon").style.display = "inline";
                        document.getElementById("weather-description").textContent = description;
                    } else {
                        document.getElementById("current-temperature").textContent = `City not found`;
                    }
                })
                .catch(error => {
                    console.error('Error fetching temperature:', error);
                    document.getElementById("current-temperature").textContent = `Error fetching temperature`;
                });
        } else {
            document.getElementById("current-temperature").textContent = `Please enter a city name`;
        }
    }

    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
    }

    setInterval(updateClock, 1000);
    setInterval(updateDate, 1000);

    document.getElementById("start").addEventListener("click", startStopwatch);
    document.getElementById("stop").addEventListener("click", stopStopwatch);
    document.getElementById("reset").addEventListener("click", resetStopwatch);
    document.getElementById("lap").addEventListener("click", lapStopwatch);
    document.getElementById("microseconds").addEventListener("click", toggleMicroseconds);
    document.getElementById("temperature").addEventListener("click", updateTemperature);
    document.getElementById("toggle-dark-mode").addEventListener("click", toggleDarkMode);
});
