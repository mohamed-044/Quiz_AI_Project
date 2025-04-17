import { getQuizData } from './localStorage.js';

const quizData = getQuizData();
if (!quizData || quizData.length === 0) {
  document.getElementById('question-content').innerText = "Aucune question trouvée.";
  throw new Error("Aucune donnée de quiz trouvée !");
}

let currentIndex = 0;
const total = quizData.length;

const questionEl = document.getElementById('question-content');
const questionNumberEl = document.getElementById('number');
const totalEl = document.getElementById('total');
const answersForm = document.getElementById('answers-form');

totalEl.innerText = total;

let selectedBlock = null;

function renderQuestion(index) {
  const q = quizData[index];
  questionEl.innerText = q.question;
  questionNumberEl.innerText = index + 1;

  selectedBlock = null;
  answersForm.innerHTML = '';

  q.choices.forEach((choice, i) => {
    const block = document.createElement('div');
    block.classList.add('answer-block');
    block.setAttribute('data-choice', choice);
    block.innerText = `${String.fromCharCode(65 + i)}. ${choice}`;

    block.addEventListener('click', () => {
      // Réinitialise la sélection visuelle
      document.querySelectorAll('.answer-block').forEach(b => b.classList.remove('selected'));
      block.classList.add('selected');
      selectedBlock = block;
    });

    answersForm.appendChild(block);
  });
}

function validateAnswer() {
  if (!selectedBlock) {
    alert("Veuillez choisir une réponse.");
    return;
  }

  const selectedChoice = selectedBlock.getAttribute('data-choice');
  const correctAnswer = quizData[currentIndex].answer;

  // Désactive les clics
  document.querySelectorAll('.answer-block').forEach(block => {
    block.classList.add('disabled');
    const choice = block.getAttribute('data-choice');

    if (choice === correctAnswer) {
      block.classList.add('correct');
    }
    if (choice === selectedChoice && choice !== correctAnswer) {
      block.classList.add('wrong');
    }
  });

  // Passe à la question suivante après 2 secondes
  setTimeout(() => {
    if (currentIndex < total - 1) {
      currentIndex++;
      renderQuestion(currentIndex);
    } else {
      questionEl.innerText = "Quiz terminé ! 🎉";
      answersForm.innerHTML = '';
      document.querySelector('.quiz-buttons').style.display = 'none';
    }
  }, 2000);
}

document.getElementById('validate-btn').addEventListener('click', (e) => {
  e.preventDefault();
  validateAnswer();
});

document.getElementById('skip-btn').addEventListener('click', () => {
  if (currentIndex < total - 1) {
    currentIndex++;
    renderQuestion(currentIndex);
  }
});

// Premier affichage
renderQuestion(currentIndex);
