document.addEventListener("DOMContentLoaded", () => {
    let timer;
    let milliseconds = 0;
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let running = false;
    let showMicroseconds = true;
    let laps = [];
    let settings = {};

    let countdownTimer;
    let countdownRunning = false;
    let intervalTimer;
    let intervalRunning = false;

    function loadSettings() {
        fetch("settings.json")
            .then(response => response.json())
            .then(data => {
                settings = data;
                applySettings();
            })
            .catch(error => console.error("Error loading settings:", error));
    }

    function applySettings() {
        if (settings.darkMode) {
            document.body.classList.add("dark-mode");
        }
        showMicroseconds = settings.showMicroseconds;
        document.getElementById("city").value = settings.defaultCity;
    }

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
        saveStopwatch({
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            duration: `${hours}h ${minutes}m ${seconds}s`
        });
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
        saveLaps(); // Save the empty laps array to reset the stored laps
    }

    function lapStopwatch() {
        if (running) {
            const lapTime = document.getElementById("display").textContent;
            laps.push({ id: generateId(), time: lapTime });
            updateLaps();
            saveLaps();
        }
    }

    function updateLaps() {
        const lapsList = document.getElementById("laps-list");
        lapsList.innerHTML = '';
        laps.forEach((lap, index) => {
            if (lap && lap.time) {
                const li = document.createElement("li");
                li.textContent = `Lap ${index + 1}: ${lap.time}`;
                lapsList.appendChild(li);
            }
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

    async function saveStopwatch(data) {
        console.log("Sending request to JSON Server with data:", data);

        try {
            const response = await fetch("http://localhost:3000/stopwatch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log("Stopwatch saved:", await response.json());
        } catch (error) {
            console.error("Error saving stopwatch:", error);
            alert("Failed to save stopwatch data. Please check the server.");
        }
    }

    function loadStopwatch() {
        fetch("http://localhost:3000/stopwatch")
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const lastEntry = data[data.length - 1];
                    console.log("Loaded stopwatch data:", lastEntry);
                    // Update the stopwatch display with the loaded data
                    // This is a placeholder, you can customize it as needed
                    document.getElementById("display").textContent = `${lastEntry.duration}`;
                }
            })
            .catch(error => console.error("Error loading stopwatch data:", error));
    }

    function saveLaps() {
        fetch("http://localhost:3000/laps", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(laps)
        })
        .then(response => response.json())
        .then(data => console.log("Laps saved:", data))
        .catch(error => console.error("Error saving laps:", error));
    }

    function loadLaps() {
        fetch("http://localhost:3000/laps")
            .then(response => response.json())
            .then(data => {
                laps = data;
                updateLaps();
                console.log("Loaded laps data:", data);
            })
            .catch(error => console.error("Error loading laps data:", error));
    }

    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
    }

    function generateId() {
        return Math.random().toString(36).substr(2, 4);
    }

    function startCountdown() {
        if (!countdownRunning) {
            countdownRunning = true;
            let minutes = parseInt(document.getElementById("countdown-minutes").value) || 0;
            let seconds = parseInt(document.getElementById("countdown-seconds").value) || 0;
            let totalSeconds = minutes * 60 + seconds;

            countdownTimer = setInterval(() => {
                if (totalSeconds <= 0) {
                    clearInterval(countdownTimer);
                    countdownRunning = false;
                    document.getElementById("countdown-display").textContent = "00:00";
                    alert("Countdown finished!");
                } else {
                    totalSeconds--;
                    let min = Math.floor(totalSeconds / 60);
                    let sec = totalSeconds % 60;
                    document.getElementById("countdown-display").textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
                }
            }, 1000);
        }
    }

    function stopCountdown() {
        clearInterval(countdownTimer);
        countdownRunning = false;
    }

    function startInterval() {
        if (!intervalRunning) {
            intervalRunning = true;
            let minutes = parseInt(document.getElementById("interval-minutes").value) || 0;
            let seconds = parseInt(document.getElementById("interval-seconds").value) || 0;
            let totalSeconds = minutes * 60 + seconds;

            intervalTimer = setInterval(() => {
                if (totalSeconds <= 0) {
                    clearInterval(intervalTimer);
                    intervalRunning = false;
                    document.getElementById("interval-display").textContent = "00:00";
                    alert("Interval finished!");
                } else {
                    totalSeconds--;
                    let min = Math.floor(totalSeconds / 60);
                    let sec = totalSeconds % 60;
                    document.getElementById("interval-display").textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
                }
            }, 1000);
        }
    }

    function stopInterval() {
        clearInterval(intervalTimer);
        intervalRunning = false;
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
    document.getElementById("start-countdown").addEventListener("click", startCountdown);
    document.getElementById("stop-countdown").addEventListener("click", stopCountdown);
    document.getElementById("start-interval").addEventListener("click", startInterval);
    document.getElementById("stop-interval").addEventListener("click", stopInterval);

    // Load settings, stopwatch data, and laps when the page loads
    loadSettings();
    loadStopwatch();
    loadLaps();
});

document.getElementById('start').addEventListener('click', () => {
    const beepSound = document.getElementById("startSound");
    if (beepSound) {
        beepSound.play().catch(error => console.error("Audio play error:", error));
    }
});

document.getElementById('stop').addEventListener('click', () => {
    const beepSound = document.getElementById("stopSound");
    if (beepSound) {
        beepSound.play().catch(error => console.error("Audio play error:", error));
    } else {
        console.warn("Audio file not found!");
    }
});