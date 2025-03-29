function testStartTimer() {
    console.log("Testing Start Timer...");
    startStopwatch();
    setTimeout(() => {
        const elapsedTime = getElapsedTime(); // Assuming getElapsedTime() exists
        if (elapsedTime > 0) {
            console.log("Timer started successfully.");
        } else {
            console.error("Failed to start the timer.");
        }
        stopStopwatch();
    }, 1000);
}

function testStopTimer() {
    console.log("Testing Stop Timer...");
    startStopwatch();
    setTimeout(() => {
        stopStopwatch();
        const elapsedTime = getElapsedTime();
        const stoppedTime = elapsedTime;
        setTimeout(() => {
            if (getElapsedTime() === stoppedTime) {
                console.log("Timer stopped successfully.");
            } else {
                console.error("Failed to stop the timer.");
            }
        }, 500);
    }, 1000);
}

function testResetTimer() {
    console.log("Testing Reset Timer...");
    startStopwatch();
    setTimeout(() => {
        resetStopwatch();
        if (getElapsedTime() === 0) {
            console.log("Timer reset successfully.");
        } else {
            console.error("Failed to reset the timer.");
        }
    }, 1000);
}

function testLapTimer() {
    console.log("Testing Lap Timer...");
    startStopwatch();
    setTimeout(() => {
        const lapTime = lapStopwatch();
        if (lapTime > 0) {
            console.log("Lap recorded successfully.");
        } else {
            console.error("Failed to record lap.");
        }
        stopStopwatch();
    }, 1000);
}

function runTests() {
    testStartTimer();
    setTimeout(testStopTimer, 2000);
    setTimeout(testResetTimer, 4000);
    setTimeout(testLapTimer, 6000);
}

runTests();
