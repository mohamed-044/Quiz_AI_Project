import { Storage } from './localStorage.js';

const questionEl = document.getElementById("question-content");
const numberEl = document.getElementById("number");
const totalEl = document.getElementById("total");
const answersForm = document.getElementById("answers-form");
const validateBtn = document.getElementById("validate-btn");
const skipBtn = document.getElementById("skip-btn");

let quizData = [];
let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timerInterval;
let selectedBlock = null;
let theme = localStorage.getItem("rushTheme");
let difficulty = localStorage.getItem("rushDifficulty");

// Contrôle du timer
let isTimerPaused = false;

// UI init
totalEl.textContent = "∞";

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (!isTimerPaused) {
      timeLeft--;
      updateTimerDisplay();

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        alert("⏱️ Temps écoulé !");
        Storage.saveScore(score);
        window.location.href = "results.html";
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  if (isTimerPaused) return;
  document.title = `⏱️ ${timeLeft}s - Rush`;
  const timerSpan = document.getElementById("timer");
  if (timerSpan) {
    timerSpan.textContent = timeLeft;
  }
}

function pauseTimer() {
  isTimerPaused = true;
}

function resumeTimer() {
  isTimerPaused = false;
  startTimer();
}

async function generateRushQuestions() {
  console.log('🔄 Génération d’un nouveau lot de questions Rush...');
  pauseTimer();

  questionEl.textContent = 'Chargement de nouvelles questions...';
  answersForm.style.display = "none";

  try {
    const response = await fetch('http://localhost:3000/generate-rush', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        theme,
        difficulty,
        questionCount: 10
      })
    });

    const data = await response.json();
    const questions = JSON.parse(data.quiz);
    quizData = quizData.concat(questions);

    // 🔄 Mise à jour du localStorage avec toutes les questions
    Storage.saveQuiz(quizData);

    resumeTimer();
    loadQuestion();

  } catch (err) {
    console.error("❌ Erreur lors de la génération des questions Rush :", err);
    alert("Erreur lors de la génération des questions. Vérifie le serveur.");
    clearInterval(timerInterval);
  }
}

function loadQuestion() {
  if (currentQuestion >= quizData.length) {
    console.log('🛑 Fin de la série de questions. Génération suivante...');
    generateRushQuestions();
    return;
  }

  const current = quizData[currentQuestion];
  numberEl.textContent = currentQuestion + 1;
  questionEl.textContent = current.question;
  answersForm.innerHTML = "";
  answersForm.style.display = "block";
  selectedBlock = null;

  current.choices.forEach((choice, index) => {
    const block = document.createElement("div");
    block.classList.add("answer-block");
    block.setAttribute("data-choice", choice);
    block.innerText = `${String.fromCharCode(65 + index)}. ${choice}`;

    block.addEventListener("click", () => {
      document.querySelectorAll(".answer-block").forEach(b => b.classList.remove("selected"));
      block.classList.add("selected");
      selectedBlock = block;
    });

    answersForm.appendChild(block);
  });
}

validateBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (!selectedBlock) {
    alert("Sélectionne une réponse !");
    return;
  }

  const userAnswer = selectedBlock.getAttribute("data-choice");
  const correctAnswer = quizData[currentQuestion].answer;

  document.querySelectorAll(".answer-block").forEach(block => {
    block.classList.add("disabled");
    const choice = block.getAttribute("data-choice");
    if (choice === correctAnswer) {
      block.classList.add("correct");
    }
    if (choice === userAnswer && choice !== correctAnswer) {
      block.classList.add("wrong");
    }
  });

  if (userAnswer === correctAnswer) {
    score++;
    if ((currentQuestion + 1) % 10 === 0) {
      timeLeft = Math.min(60, timeLeft + 10);
      console.log("⏱️ Bonus temps accordé !");
    }
  } else {
    timeLeft = Math.max(0, timeLeft - 3);
    console.log("🕑 Temps pénalisé pour mauvaise réponse !");
  }

  // 🧠 Sauvegarde la réponse
  Storage.saveAnswer(currentQuestion, userAnswer);

  currentQuestion++;
  setTimeout(() => loadQuestion(), 1500);
});

skipBtn.addEventListener("click", () => {
  Storage.saveAnswer(currentQuestion, null);
  currentQuestion++;
  loadQuestion();
});

localStorage.setItem("lastMode", "rush");
generateRushQuestions();
startTimer();
updateTimerDisplay();
