import { Storage } from './localStorage.js';

// Récupération des données
const quizData = Storage.getQuiz();
let currentQuestion = Storage.getProgress();
let score = Storage.getScore();

// Éléments HTML
const questionEl = document.getElementById("question-content");
const numberEl = document.getElementById("number");
const totalEl = document.getElementById("total");
const answersForm = document.getElementById("answers-form");
const validateBtn = document.getElementById("validate-btn");
const skipBtn = document.getElementById("skip-btn");

// Total des questions
totalEl.textContent = quizData.length;

// Charger une question
function loadQuestion() {
  if (currentQuestion >= quizData.length) {
    Storage.saveScore(score);
    window.location.href = "results.html"; // Redirection après le quiz
    return;
  }

  const current = quizData[currentQuestion];
  numberEl.textContent = currentQuestion + 1;
  questionEl.textContent = current.question;

  // Nettoyer les anciennes réponses
  answersForm.innerHTML = "";

  current.choices.forEach((choice, index) => {
    const id = `choice-${index}`;
    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.innerHTML = `
      <input type="radio" name="answer" value="${choice}" id="${id}" required>
      ${choice}
    `;
    answersForm.appendChild(label);
    answersForm.appendChild(document.createElement("br"));
  });
}

// Quand l'utilisateur clique sur "Valider"
validateBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const selected = answersForm.querySelector('input[name="answer"]:checked');
  if (!selected) {
    alert("Sélectionne une réponse !");
    return;
  }

  const userAnswer = selected.value;
  const correctAnswer = quizData[currentQuestion].answer;

  // Sauvegarder la réponse utilisateur
  Storage.saveAnswer(currentQuestion, userAnswer);

  // Vérifier la réponse
  if (userAnswer === correctAnswer) {
    score++;
  }

  // Sauvegarder progression
  currentQuestion++;
  Storage.saveProgress(currentQuestion);
  Storage.saveScore(score);

  loadQuestion();
});

// Bouton "Sauter"
skipBtn.addEventListener("click", function () {
  // Enregistre une réponse nulle (sautée)
  Storage.saveAnswer(currentQuestion, null);
  currentQuestion++;
  Storage.saveProgress(currentQuestion);
  loadQuestion();
});

// Lancer le quiz
loadQuestion();
