import { saveQuizData } from './localStorage.js';

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
      alert("Erreur lors de la génération du quiz.");
      return;
    }

    let quizArray;

    try {
      quizArray = JSON.parse(data.quiz);
    } catch (err) {
      alert("Le quiz n'est pas au format JSON. Vérifie le backend.");
      return;
    }

    // Sauvegarde dans localStorage
    saveQuizData(quizArray);

    // Redirection vers la page quiz
    window.location.href = 'quiz.html';

  } catch (err) {
    alert(`Erreur de communication avec le serveur. ${err}`);
  }
});
