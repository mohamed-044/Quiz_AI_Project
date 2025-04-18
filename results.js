import { Storage } from "./localStorage.js";

const mode = localStorage.getItem("lastMode"); // "classic" ou "rush"
const score = Storage.getScore();
const answers = Storage.getAnswers();
const questions = Storage.getQuiz();

const container = document.getElementById("results-container");
const title = document.getElementById("results-title");

// Définir le titre en fonction du mode de jeu
if (mode === "classic") {
  title.textContent = "Résultats du mode Classique";
} else if (mode === "rush") {
  title.textContent = "Résultats du mode Rush";
} else {
  title.textContent = "Résultats";
}

// Affichage du score et des statistiques de base
container.innerHTML = `
  <p id="final-score"><strong>Score :</strong> ${score}</p>
  <p id="answers-count"><strong>Réponses données :</strong> ${answers.length}</p>
  <p id="questions-total"><strong>Total de questions :</strong> ${questions.length}</p>
`;

// 💡 Bonus : liste détaillée des questions et des réponses
const detailedList = document.createElement("ol");
detailedList.id = "results-list";

questions.forEach((q, i) => {
  const userAnswer = answers[i] ?? "Aucune réponse";
  const isCorrect = userAnswer === q.answer;

  const item = document.createElement("li");
  item.classList.add("result-item");
  item.innerHTML = `
    <p class="question-text"><strong>${q.question}</strong></p>
    <p>➤ Ta réponse : <span class="${isCorrect ? 'correct-answer' : 'wrong-answer'}">${userAnswer}</span></p>
    <p>✅ Bonne réponse : <span class="correct-answer">${q.answer}</span></p>
  `;
  detailedList.appendChild(item);
});

container.appendChild(detailedList);
