import { Storage } from './localStorage.js';

document.getElementById('quiz-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const theme = document.getElementById('theme').value;
  const difficulty = document.getElementById('difficulty').value;
  const questionCount = document.getElementById('questionCount').value;

  try {
    const response = await fetch('http://localhost:3000/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme, difficulty, questionCount })
    });

    const data = await response.json();

    if (!data.quiz) {
      alert("❌ Erreur lors de la génération du quiz.");
      return;
    }

    let quizArray;

    try {
      quizArray = JSON.parse(data.quiz);
    } catch (err) {
      console.error("❌ La réponse de l'API n'était pas un JSON valide.");
      console.log("Contenu brut :", data.quiz);
      alert("⚠️ Le quiz reçu n'est pas au bon format JSON. Vérifie le backend.");
      return;
    }

    // Sauvegarde dans le localStorage via notre module
    Storage.reset(); // Nettoyage au cas où
    Storage.saveQuiz(quizArray);
    Storage.saveProgress(0);
    Storage.saveScore(0);

    // Redirection vers la page du quiz
    window.location.href = "quiz.html";

  } catch (err) {
    console.error("❌ Erreur de communication avec le serveur :", err);
    alert(`Erreur de communication avec le serveur. ${err.message}`);
  }
});
