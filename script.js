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
  
      if (data.quiz) {
        alert(`Quiz généré avec succès ! : ${data.quiz}`);
        console.log(data.quiz);
 
      } else {
        alert("Erreur lors de la génération du quiz.");
      }

    } catch (err) {
      console.error(err);
      alert("Erreur de communication avec le serveur.");
    }
  });