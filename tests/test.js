function testStartTimer() {
    console.log("Testing Start Timer...");
    startStopwatch();
    setTimeout(() => {
        stopStopwatch();
        console.log("Timer started and stopped successfully.");
    }, 1000);
}

function testStopTimer() {
    console.log("Testing Stop Timer...");
    startStopwatch();
    setTimeout(() => {
        stopStopwatch();
        console.log("Timer stopped successfully.");
    }, 1000);
}

function testResetTimer() {
    console.log("Testing Reset Timer...");
    startStopwatch();
    setTimeout(() => {
        resetStopwatch();
        console.log("Timer reset successfully.");
    }, 1000);
}

function testLapTimer() {
    console.log("Testing Lap Timer...");
    startStopwatch();
    setTimeout(() => {
        lapStopwatch();
        console.log("Lap recorded successfully.");
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
