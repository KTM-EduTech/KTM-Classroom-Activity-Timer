let selectedSeconds = 60;
let timerInterval = null;
let endTime = null;
let isPaused = false;
let isFinished = false;

const minutesEl     = document.getElementById('minutes');
const secondsEl     = document.getElementById('seconds');
const timerDisplay  = document.getElementById('timer-display');
const finishedBox   = document.getElementById('finished-box');
const optionsPanel  = document.getElementById('options-panel');
const actionPanel   = document.getElementById('action-panel');
const pauseBtn      = document.getElementById('pause-btn');
const resetBtn      = document.getElementById('reset-btn');
const goBtn         = document.getElementById('go-btn');

// Select option
document.querySelectorAll('.option').forEach(option => {
  option.addEventListener('click', () => {
    document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
    option.classList.add('selected');
    selectedSeconds = parseInt(option.dataset.seconds);
  });
});

// Go button
goBtn.addEventListener('click', startTimer);

function startTimer() {
  optionsPanel.style.display = 'none';
  actionPanel.style.display = 'flex';
  timerDisplay.style.display = 'flex';
  finishedBox.style.display = 'none';

  isPaused = false;
  isFinished = false;
  pauseBtn.textContent = '‖ Pause';

  const durationMs = selectedSeconds * 1000;
  endTime = Date.now() + durationMs;

  updateDisplay(selectedSeconds * 1000);
  timerInterval = setInterval(updateTimer, 30); // high precision update
}

function updateTimer() {
  if (isPaused || isFinished) return;

  const remaining = Math.max(0, endTime - Date.now());

  if (remaining <= 0) {
    finishTimer();
    return;
  }

  updateDisplay(remaining);
}

function updateDisplay(remainingMs) {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const min = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;

  minutesEl.textContent = min;
  secondsEl.textContent = sec < 10 ? '0' + sec : sec;
}

function finishTimer() {
  clearInterval(timerInterval);
  isFinished = true;

  timerDisplay.style.display = 'none';
  finishedBox.style.display = 'flex';
  pauseBtn.style.opacity = '0.5';
  pauseBtn.disabled = true;
}

// Pause / Resume
pauseBtn.addEventListener('click', () => {
  if (isFinished) return;

  isPaused = !isPaused;

  if (isPaused) {
    pauseBtn.textContent = '▶ Resume';
    clearInterval(timerInterval);
  } else {
    pauseBtn.textContent = '‖ Pause';
    endTime = Date.now() + (parseInt(minutesEl.textContent) * 60 + parseInt(secondsEl.textContent)) * 1000;
    timerInterval = setInterval(updateTimer, 30);
  }
});

// Reset
resetBtn.addEventListener('click', resetToSelection);

function resetToSelection() {
  clearInterval(timerInterval);
  isPaused = false;
  isFinished = false;

  optionsPanel.style.display = 'flex';
  actionPanel.style.display = 'none';
  timerDisplay.style.display = 'flex';
  finishedBox.style.display = 'none';

  minutesEl.textContent = '1';
  secondsEl.textContent = '00';
  pauseBtn.style.opacity = '1';
  pauseBtn.disabled = false;

  // Re-select 1 min
  document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
  document.querySelector('[data-seconds="60"]').classList.add('selected');
  selectedSeconds = 60;
}
