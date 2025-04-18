import { Storage } from './localStorage.js';

// Récupération des données
const quizData = Storage.getQuiz();
let currentQuestion = Storage.getProgress();
let score = Storage.getScore();

console.log("🎮 Démarrage du quiz");
console.log("📦 Données quiz récupérées :", quizData);
console.log("▶️ Question actuelle :", currentQuestion);
console.log("⭐ Score actuel :", score);

// Éléments HTML
const questionEl = document.getElementById("question-content");
const numberEl = document.getElementById("number");
const totalEl = document.getElementById("total");
const answersForm = document.getElementById("answers-form");
const validateBtn = document.getElementById("validate-btn");
const skipBtn = document.getElementById("skip-btn");

// Total des questions
totalEl.textContent = quizData.length;

let selectedBlock = null;

// Charger une question
function loadQuestion() {
  console.log("📥 Chargement de la question n°", currentQuestion + 1);

  if (currentQuestion >= quizData.length) {
    console.log("✅ Quiz terminé. Score final :", score);
    Storage.saveScore(score);
    window.location.href = "results.html";
    return;
  }

  const current = quizData[currentQuestion];
  numberEl.textContent = currentQuestion + 1;
  questionEl.textContent = current.question;
  answersForm.innerHTML = "";
  selectedBlock = null;

  current.choices.forEach((choice, index) => {
    const block = document.createElement("div");
    block.classList.add("answer-block");
    block.setAttribute("data-choice", choice);
    block.innerText = `${String.fromCharCode(65 + index)}. ${choice}`;

    block.addEventListener("click", () => {
      console.log("🖱️ Réponse sélectionnée :", choice);
      document.querySelectorAll(".answer-block").forEach(b => b.classList.remove("selected"));
      block.classList.add("selected");
      selectedBlock = block;
    });

    answersForm.appendChild(block);
  });
}

// Quand l'utilisateur clique sur "Valider"
validateBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (!selectedBlock) {
    alert("Sélectionne une réponse !");
    return;
  }

  const userAnswer = selectedBlock.getAttribute("data-choice");
  const correctAnswer = quizData[currentQuestion].answer;

  console.log("📌 Réponse utilisateur :", userAnswer);
  console.log("✅ Bonne réponse :", correctAnswer);

  Storage.saveAnswer(currentQuestion, userAnswer);

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
    console.log("🎉 Bonne réponse ! Score +1 →", score);
  } else {
    console.log("❌ Mauvaise réponse.");
  }

  currentQuestion++;
  Storage.saveProgress(currentQuestion);
  Storage.saveScore(score);

  setTimeout(() => {
    loadQuestion();
  }, 2000);
});

// Bouton "Sauter"
skipBtn.addEventListener("click", function () {
  console.log("⏭️ Question sautée.");
  Storage.saveAnswer(currentQuestion, null);
  currentQuestion++;
  Storage.saveProgress(currentQuestion);
  loadQuestion();
});

// Lancer le quiz
loadQuestion();
