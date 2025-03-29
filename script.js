document.addEventListener("DOMContentLoaded", () => {
    // Global Variables
    let timer, countdownTimer, intervalTimer;
    let milliseconds = 0, seconds = 0, minutes = 0, hours = 0;
    let countdownRemainingSeconds = 0, intervalRemainingSeconds = 0;
    let intervalCycles = 0, currentCycle = 0;
    let running = false, countdownRunning = false, intervalRunning = false;
    let countdownPaused = false, intervalPaused = false;
    let laps = [];
    const alertSound = document.getElementById("alert-sound");

    // Utility Functions
    const formatTime = (totalSeconds) => {
        const min = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const sec = (totalSeconds % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    };

    const updateElementText = (id, text) => {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    };

    const playSound = (soundId) => {
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.play().catch((error) => console.error(`Audio play error: ${error}`));
        }
    };

    // Utility Function to Show Visual Alert
    function showVisualAlert() {
        const alertBox = document.getElementById("visual-alert");
        if (alertBox) {
            alertBox.classList.remove("hidden");
            setTimeout(() => {
                alertBox.classList.add("hidden");
            }, 5000); // Hide the alert after 5 seconds
        }
    }

    // Stopwatch Functions
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
                updateStopwatchDisplay();
            }, 1);
        }
    }

    function stopStopwatch() {
        clearInterval(timer);
        running = false;
        playSound("stopSound");
    }

    function resetStopwatch() {
        clearInterval(timer);
        running = false;
        milliseconds = seconds = minutes = hours = 0;
        laps = [];
        updateStopwatchDisplay();
        updateLaps();
    }

    function lapStopwatch() {
        if (running) {
            const lapTime = document.getElementById("display").textContent;
            laps.push(lapTime);
            updateLaps();
        }
    }

    function updateStopwatchDisplay() {
        const ms = milliseconds.toString().padStart(3, '0');
        const sec = seconds.toString().padStart(2, '0');
        const min = minutes.toString().padStart(2, '0');
        const hr = hours.toString().padStart(2, '0');
        updateElementText("display", `${hr}:${min}:${sec}.${ms}`);
    }

    function updateLaps() {
        const lapsList = document.getElementById("laps-list");
        if (lapsList) {
            lapsList.innerHTML = laps.map((lap, index) => `<li>Lap ${index + 1}: ${lap}</li>`).join('');
        }
    }

    // Reset Laps Function
    function resetLaps() {
        laps = [];
        const lapsList = document.getElementById("laps-list");
        if (lapsList) lapsList.innerHTML = '';
        console.log("Laps have been reset.");
    }

    // Countdown Timer Functions
    function startCountdown() {
        if (!countdownRunning) {
            countdownRunning = true;
            const minutes = parseInt(document.getElementById("countdown-minutes").value) || 0;
            const seconds = parseInt(document.getElementById("countdown-seconds").value) || 0;
            countdownRemainingSeconds = countdownPaused ? countdownRemainingSeconds : minutes * 60 + seconds;

            countdownTimer = setInterval(() => {
                if (countdownRemainingSeconds <= 0) {
                    clearInterval(countdownTimer);
                    countdownRunning = false;
                    countdownPaused = false;
                    updateElementText("countdown-display", "00:00");
                    showVisualAlert(); // Trigger visual alert
                } else {
                    countdownRemainingSeconds--;
                    updateElementText("countdown-display", formatTime(countdownRemainingSeconds));
                }
            }, 1000);
        }
    }

    function pauseCountdown() {
        if (countdownRunning) {
            clearInterval(countdownTimer);
            countdownRunning = false;
            countdownPaused = true;
        }
    }

    function resumeCountdown() {
        if (countdownPaused) {
            countdownPaused = false;
            startCountdown();
        }
    }

    function stopCountdown() {
        clearInterval(countdownTimer);
        countdownRunning = false;
        countdownPaused = false;
        countdownRemainingSeconds = 0;
        updateElementText("countdown-display", "00:00");
    }

    // Interval Timer Functions
    function startInterval() {
        if (!intervalRunning) {
            intervalRunning = true;
            const minutes = parseInt(document.getElementById("interval-minutes").value) || 0;
            const seconds = parseInt(document.getElementById("interval-seconds").value) || 0;
            intervalCycles = parseInt(document.getElementById("interval-cycles").value) || 1;
            intervalRemainingSeconds = intervalPaused ? intervalRemainingSeconds : minutes * 60 + seconds;
            currentCycle = intervalPaused ? currentCycle : 0;

            function runInterval() {
                if (currentCycle >= intervalCycles) {
                    clearInterval(intervalTimer);
                    intervalRunning = false;
                    intervalPaused = false;
                    updateElementText("interval-display", "00:00");
                    updateElementText("interval-cycle-display", `Cycle: ${currentCycle}/${intervalCycles}`);
                    showVisualAlert(); // Trigger visual alert
                    return;
                }

                currentCycle++;
                updateElementText("interval-cycle-display", `Cycle: ${currentCycle}/${intervalCycles}`);

                intervalTimer = setInterval(() => {
                    if (intervalRemainingSeconds <= 0) {
                        clearInterval(intervalTimer);
                        runInterval();
                    } else {
                        intervalRemainingSeconds--;
                        updateElementText("interval-display", formatTime(intervalRemainingSeconds));
                    }
                }, 1000);
            }

            runInterval();
        }
    }

    function pauseInterval() {
        if (intervalRunning) {
            clearInterval(intervalTimer);
            intervalRunning = false;
            intervalPaused = true;
        }
    }

    function resumeInterval() {
        if (intervalPaused) {
            intervalPaused = false;
            startInterval();
        }
    }

    function stopInterval() {
        clearInterval(intervalTimer);
        intervalRunning = false;
        intervalPaused = false;
        intervalRemainingSeconds = 0;
        currentCycle = 0;
        updateElementText("interval-display", "00:00");
        updateElementText("interval-cycle-display", "Cycle: 0/0");
    }

    // Event Listeners
    document.getElementById("start").addEventListener("click", startStopwatch);
    document.getElementById("stop").addEventListener("click", stopStopwatch);
    document.getElementById("reset").addEventListener("click", resetStopwatch);
    document.getElementById("lap").addEventListener("click", lapStopwatch);

    document.getElementById("start-countdown").addEventListener("click", startCountdown);
    document.getElementById("pause-countdown").addEventListener("click", pauseCountdown);
    document.getElementById("resume-countdown").addEventListener("click", resumeCountdown);
    document.getElementById("stop-countdown").addEventListener("click", stopCountdown);

    document.getElementById("start-interval").addEventListener("click", startInterval);
    document.getElementById("pause-interval").addEventListener("click", pauseInterval);
    document.getElementById("resume-interval").addEventListener("click", resumeInterval);
    document.getElementById("stop-interval").addEventListener("click", stopInterval);

    document.getElementById("reset-laps").addEventListener("click", resetLaps);
});