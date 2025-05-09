import { Storage } from './localStorage.js';

document.getElementById('quiz-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('📩 Formulaire soumis');

  const trigger = e.submitter?.id;

  const quizform = document.getElementById("quiz-form");
  quizform.style.display = 'none';
  console.log('📤 Formulaire masqué');

  const loader = document.getElementById('loader');
  loader.style.display = 'block';
  console.log('⏳ Affichage du loader');

  const theme = document.getElementById('theme').value;
  const difficulty = document.getElementById('difficulty').value;
  const questionCount = document.getElementById('questionCount').value;

  console.log(`📨 Envoi de la requête au backend avec :
  - Thème : ${theme}
  - Difficulté : ${difficulty}
  - Nombre de questions : ${questionCount}
  - Mode : ${trigger}`);

  const endpoint = trigger === "start-rush" ? 'generate-rush' : 'generate-quiz';

  try {
    const response = await fetch(`http://localhost:3000/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme, difficulty, questionCount })
    });

    const data = await response.json();
    console.log('✅ Réponse reçue du serveur :', data);

    if (!data.quiz) {
      alert("❌ Erreur lors de la génération du quiz.");
      console.warn("⚠️ Le champ `quiz` est manquant dans la réponse.");
      loader.style.display = 'none';
      quizform.style.display = 'block';
      return;
    }

    let quizArray;

    try {
      quizArray = JSON.parse(data.quiz);
      console.log('🧠 Quiz parsé avec succès. Nombre de questions :', quizArray.length);
    } catch (err) {
      console.error("❌ La réponse de l'API n'était pas un JSON valide.");
      console.log("Contenu brut :", data.quiz);
      alert("⚠️ Le quiz reçu n'est pas au bon format JSON. Vérifie le backend.");
      loader.style.display = 'none';
      quizform.style.display = 'block';
      return;
    }

    // Sauvegarde dans le localStorage via notre module
    console.log('💾 Sauvegarde du quiz dans le localStorage...');
    Storage.reset(); // Nettoyage au cas où
    Storage.saveQuiz(quizArray);
    Storage.saveProgress(0);
    Storage.saveScore(0);
    console.log('✅ Quiz sauvegardé avec succès');

    // 🔒 Sauvegarde du contexte Rush si besoin
    if (trigger === "start-rush") {
      localStorage.setItem("rushTheme", theme);
      localStorage.setItem("rushDifficulty", difficulty);
    }

    // Redirection
    const redirectTo = trigger === "start-rush" ? "rush.html" : "quiz.html";
    console.log(`➡️ Redirection vers ${redirectTo}`);
    window.location.href = redirectTo;

  } catch (err) {
    console.error("❌ Erreur de communication avec le serveur :", err);
    alert(`Erreur de communication avec le serveur. ${err.message}`);
    loader.style.display = 'none';
    quizform.style.display = 'block';
  }
});
