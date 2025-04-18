import { Storage } from './localStorage.js';

console.log("📦 Script de génération de quiz chargé.");

document.getElementById('quiz-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const quizform = document.getElementById("quiz-form");
  const loader = document.getElementById('loader');

  console.log("🖱️ Formulaire soumis. Récupération des champs...");

  quizform.style.display = 'none';
  loader.style.display = 'block';

  const theme = document.getElementById('theme').value;
  const difficulty = document.getElementById('difficulty').value;
  const questionCount = document.getElementById('questionCount').value;

  console.log(`📋 Données : Thème = ${theme}, Difficulté = ${difficulty}, Nombre = ${questionCount}`);

  try {
    console.log("🚀 Envoi de la requête à /generate-quiz...");
    const response = await fetch('http://localhost:3000/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme, difficulty, questionCount })
    });

    console.log("📥 Réponse reçue du serveur.");

    const data = await response.json();

    if (!data.quiz) {
      console.error("❌ Erreur : Pas de quiz dans la réponse.");
      alert("❌ Erreur lors de la génération du quiz.");
      quizform.style.display = 'block';
      loader.style.display = 'none';
      return;
    }

    let quizArray;

    try {
      quizArray = JSON.parse(data.quiz);
      console.log("✅ Quiz JSON parsé avec succès :", quizArray);
    } catch (err) {
      console.error("❌ La réponse de l'API n'était pas un JSON valide.");
      console.log("Contenu brut :", data.quiz);
      alert("⚠️ Le quiz reçu n'est pas au bon format JSON. Vérifie le backend.");
      quizform.style.display = 'block';
      loader.style.display = 'none';
      return;
    }

    console.log("💾 Sauvegarde du quiz dans localStorage...");
    Storage.reset();
    Storage.saveQuiz(quizArray);
    Storage.saveProgress(0);
    Storage.saveScore(0);

    console.log("➡️ Redirection vers quiz.html");
    window.location.href = "quiz.html";

  } catch (err) {
    console.error("❌ Erreur de communication avec le serveur :", err);
    alert(`Erreur de communication avec le serveur. ${err.message}`);
    quizform.style.display = 'block';
    loader.style.display = 'none';
  }
});
