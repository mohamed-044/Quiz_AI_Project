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
      console.error("❌ La réponse n'était pas un JSON valide.");
      console.log(data.quiz);
      alert("Le quiz n'est pas au format JSON. Vérifie le backend.");
      return;
    }

    // Affiche simplement les questions et réponses dans la console
    quizArray.forEach((item, index) => {
      console.log(`Question ${index + 1}: ${item.question}`);
      item.choices.forEach((choice, i) => {
        console.log(`  ${String.fromCharCode(65 + i)}. ${choice}`);
      });
      console.log(`Réponse correcte: ${item.answer}`);
      console.log('-------------------');
    });

    alert("✅ Quiz généré avec succès !");

  } catch (err) {
    console.error(err);
    alert(`Erreur de communication avec le serveur. ${err}`);
  }
});
