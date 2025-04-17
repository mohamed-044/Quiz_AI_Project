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
  
      const quizContainer = document.getElementById('quiz-container');
      quizContainer.innerHTML = '';
  
      quizArray.forEach((item, index) => {
        const questionEl = document.createElement('div');
        questionEl.innerHTML = `
          <h3>Q${index + 1} : ${item.question}</h3>
          <ul>
            ${item.choices.map((choice, i) => `<li>${String.fromCharCode(65 + i)}. ${choice}</li>`).join('')}
          </ul>
          <p><strong>Réponse correcte :</strong> ${item.answer}</p>
          <hr />
        `;
        quizContainer.appendChild(questionEl);
      });
  
      alert("✅ Quiz généré avec succès !");
  
    } catch (err) {
      console.error(err);
      alert("Erreur de communication avec le serveur.");
    }
  });
  