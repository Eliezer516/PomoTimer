// Obtenemos referencias a los elementos del DOM
const minutesLabel = document.getElementById("minutes");
const secondsLabel = document.getElementById("seconds");
const startButton = document.getElementById("startBtn");
const pauseButton = document.getElementById("pauseBtn");
const resetButton = document.getElementById("resetBtn");
const progressBar = document.querySelector('progress')
const sessionInfo = document.querySelector('#session-info')
const draggWindow = document.querySelector("#dragg-window")
const styles = document.querySelector('link')

const totalWorkSessions = 4;
const shortBreakDuration = 300; // 5 minutos en segundos para el descanso corto
const longBreakDuration = 900; // 15 minutos en segundos para el descanso prolongado
const workSessionDuration = 1500; // 25 minutos en segundos para el trabajo

let sessionCounter = 0;
let isWorkSession = true; // Indica si es una sesión de trabajo o de descanso
let secondsRemaining;
let intervalId;




function startTimer() {
  playStartSound()
  
  if (intervalId) {
    clearInterval(intervalId);
  }

  if (isWorkSession) {
    secondsRemaining = workSessionDuration;
    setTimeout(() => {
      styles.href = 'http://localhost:3000/styles/pico.green.min.css'
      sessionInfo.textContent = '¡A trabajar!'
    }, 500)
  } else {
    secondsRemaining = isLongBreakSession() ? longBreakDuration : shortBreakDuration;
    setTimeout(() => {
      styles.href = 'http://localhost:3000/styles/pico.blue.min.css'
      sessionInfo.textContent = '¡Hora de un descanso!'
    }, 500)

    if (isLongBreakSession()) {
      setTimeout(() => {
        styles.href = 'http://localhost:3000/styles/pico.orange.min.css'
        sessionInfo.textContent = '¡A descansar de verdad!'
      }, 500)
    }
  }

  intervalId = setInterval(updateTimer, 1000);
  startButton.disabled = true;
  pauseButton.disabled = false;
  resetButton.disabled = false;
}

function pauseTimer() {
  clearInterval(intervalId);
  intervalId = null;
  startButton.disabled = false;
  pauseButton.disabled = true;
  resetButton.disabled = false;
}

function resetTimer() {
  clearInterval(intervalId);
  intervalId = null;
  sessionCounter = 0;
  isWorkSession = true;
  secondsRemaining = workSessionDuration;
  updateTimer();
  startButton.disabled = false;
  pauseButton.disabled = true;
  resetButton.disabled = true;
    styles.href = 'http://localhost:3000/styles/pico.grey.min.css'

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
  const sessionEndSound = new Audio("/sounds/end-session.mp3"); // Ruta al archivo de sonido
  sessionEndSound.play();
}

function playStartSound() {
  const startSound = new Audio("/sounds/start-sound.mp3")
  startSound.play()
}
// Asociamos los eventos a los botones
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

Neutralino.init()
