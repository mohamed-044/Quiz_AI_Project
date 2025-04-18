import { Storage } from './localStorage.js';

// Récupère les données du quiz et des réponses
const quizData = Storage.getQuiz();
const userAnswers = Storage.getAnswers();
const score = Storage.getScore();

console.log("📊 Affichage des résultats");
console.log("🧠 Questions :", quizData);
console.log("📝 Réponses utilisateur :", userAnswers);
console.log("🎯 Score final :", score);

// Affiche le score final
const finalScoreEl = document.getElementById("final-score");
finalScoreEl.textContent = `Votre score : ${score}/${quizData.length}`;

// Affiche les corrections (question par question)
const resultsListEl = document.getElementById("results-list");

quizData.forEach((question, index) => {
  const userAnswer = userAnswers[index];
  const correctAnswer = question.answer;

  console.log(`🔎 Q${index + 1}:`, question.question);
  console.log("👉 Réponse utilisateur :", userAnswer);
  console.log("✅ Réponse correcte :", correctAnswer);

  // Crée un élément pour chaque question et sa correction
  const resultItem = document.createElement("div");
  resultItem.classList.add("result-item");

  const questionEl = document.createElement("p");
  questionEl.innerHTML = `<strong>Q${index + 1} :</strong> ${question.question}`;

  const answerEl = document.createElement("p");
  answerEl.innerHTML = `<strong>Votre réponse :</strong> ${userAnswer ? userAnswer : 'Aucune réponse'}`;

  const correctionEl = document.createElement("p");
  if (userAnswer === correctAnswer) {
    correctionEl.innerHTML = `<span style="color: green;">Correct !</span>`;
  } else {
    correctionEl.innerHTML = `<span style="color: red;">Incorrect !</span><br><strong>Réponse correcte :</strong> ${correctAnswer}`;
  }

  // Ajoute les éléments au conteneur des résultats
  resultItem.appendChild(questionEl);
  resultItem.appendChild(answerEl);
  resultItem.appendChild(correctionEl);

  resultsListEl.appendChild(resultItem);
});
