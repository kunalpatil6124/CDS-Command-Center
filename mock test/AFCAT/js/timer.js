const TOTAL_TIME_MINUTES = 120; // 120 minutes

document.addEventListener('DOMContentLoaded', () => {
    initTimer();
});

function initTimer() {
    let startTime = localStorage.getItem('cds_test_start_time');
    
    // If not set or invalid, start fresh
    if (!startTime) {
        startTime = Date.now();
        localStorage.setItem('cds_test_start_time', startTime);
    }
    
    // Total ms allowed
    const totalMs = TOTAL_TIME_MINUTES * 60 * 1000;
    
    function updateTimer() {
        const now = Date.now();
        const elapsed = now - parseInt(startTime, 10);
        let remaining = totalMs - elapsed;
        
        if (remaining <= 0) {
            remaining = 0;
            displayTime(0);
            if(typeof finishTest === 'function') {
                finishTest(true); // Auto-submit flag
            }
            return;
        }
        
        displayTime(remaining);
        requestAnimationFrame(updateTimer);
    }
    
    requestAnimationFrame(updateTimer);
}

function displayTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    const displayStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const timerElem = document.getElementById('timeRemaining');
    if(timerElem) {
        timerElem.textContent = displayStr;
        
        // Add danger class if less than 5 minutes
        if (minutes < 5) {
            timerElem.parentElement.style.animation = 'pulse 1s infinite alternate';
        }
    }
}
