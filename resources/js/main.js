// Obtenemos referencias a los elementos del DOM
const minutesLabel = document.getElementById("minutes");
const secondsLabel = document.getElementById("seconds");
const startButton = document.getElementById("startBtn");
const pauseButton = document.getElementById("pauseBtn");
const resetButton = document.getElementById("resetBtn");
const progressBar = document.querySelector('progress')
const sessionInfo = document.querySelector('#session-info')
const pauseResumeButton = document.querySelector("#pauseResumeButton")
const styles = document.querySelector('link')

const totalWorkSessions = 4;
const shortBreakDuration = 300; // 5 minutos en segundos para el descanso corto
const longBreakDuration = 900; // 15 minutos en segundos para el descanso prolongado
const workSessionDuration = 1500; // 25 minutos en segundos para el trabajo

let sessionCounter = 0;
let isWorkSession = true; // Indica si es una sesión de trabajo o de descanso
let secondsRemaining;
let intervalId;
let counterStart = false




function startTimer() {

  if (!counterStart) {
    playStartSound()
    counterStart = true
  }
  
  if (intervalId) {
    clearInterval(intervalId);
  }

  if (isWorkSession) {
    secondsRemaining = workSessionDuration;
    sessionInfo.textContent = '¡A trabajar!'
    styles.href = 'http://localhost:3000/styles/pico.green.min.css'
  } else {
    secondsRemaining = isLongBreakSession() ? longBreakDuration : shortBreakDuration;
    sessionInfo.textContent = '¡Hora de un descanso!'
    styles.href = 'http://localhost:3000/styles/pico.blue.min.css'
    if (isLongBreakSession()) {
      sessionInfo.textContent = '¡A descansar de verdad!'
      styles.href = 'http://localhost:3000/styles/pico.orange.min.css'
    }
  }

  intervalId = setInterval(updateTimer, 1000);
  startButton.disabled = true;
  resetButton.disabled = false;
  pauseResumeButton.disabled = false;
}

function toggleTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    pauseResumeButton.textContent = "Continuar";
  } else {
    intervalId = setInterval(updateTimer, 1000);
    pauseResumeButton.textContent = "Pausar";
  }
}

function resetTimer() {
  clearInterval(intervalId);
  intervalId = null;
  sessionCounter = 0;
  isWorkSession = true;
  secondsRemaining = workSessionDuration;
  updateTimer();
  startButton.disabled = false;
  resetButton.disabled = true;
  pauseResumeButton.textContent = "Pausar"
  styles.href = 'http://localhost:3000/styles/pico.grey.min.css'
  counterStart = false
}

function updateTimer() {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  minutesLabel.textContent = padTime(minutes);
  secondsLabel.textContent = padTime(seconds);

  const progress = ((isWorkSession ? workSessionDuration : getCurrentBreakDuration()) - secondsRemaining) / (isWorkSession ? workSessionDuration : getCurrentBreakDuration()) * 100;
  progressBar.value = progress;

  if (secondsRemaining > 0) {
    secondsRemaining--;
  } else {
    clearInterval(intervalId);
    intervalId = null;
    if (isWorkSession) {
      sessionCounter++;
      if (isLongBreakSession()) {
        isWorkSession = false;
        secondsRemaining = longBreakDuration;
      } else {
        isWorkSession = false;
        secondsRemaining = shortBreakDuration;
      }
    } else {
      isWorkSession = true;
      secondsRemaining = workSessionDuration;
    }

    playSessionEndSound()
    startTimer(); // Iniciar la siguiente sesión automáticamente
  }
}

function getCurrentBreakDuration() {
  if (sessionCounter % totalWorkSessions === 0) {
    return longBreakDuration;
  } else {
    return shortBreakDuration;
  }
}

function isLongBreakSession() {
  return sessionCounter % totalWorkSessions === 0 && sessionCounter > 0;
}

function padTime(time) {
  return time.toString().padStart(2, "0");
}

function playSessionEndSound() {
  const sessionEndSound = document.getElementById("sessionEndSound");
  sessionEndSound.play();
}

function playStartSound() {
  const startSound = document.getElementById("startSound");
  startSound.play()
}
// Asociamos los eventos a los botones
startButton.addEventListener("click", startTimer);
pauseResumeButton.addEventListener("click", toggleTimer);
resetButton.addEventListener("click", resetTimer);

Neutralino.init()
