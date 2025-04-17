export const Storage = {
    saveQuiz(data) {
      localStorage.setItem("quizData", JSON.stringify(data));
    },
  
    getQuiz() {
      return JSON.parse(localStorage.getItem("quizData")) || [];
    },
  
    saveProgress(index) {
      localStorage.setItem("quizProgress", index);
    },
  
    getProgress() {
      return parseInt(localStorage.getItem("quizProgress")) || 0;
    },
  
    saveScore(score) {
      localStorage.setItem("quizScore", score);
    },
  
    getScore() {
      return parseInt(localStorage.getItem("quizScore")) || 0;
    },
  
    saveAnswer(questionIndex, userAnswer) {
      const responses = JSON.parse(localStorage.getItem("userAnswers")) || [];
      responses[questionIndex] = userAnswer;
      localStorage.setItem("userAnswers", JSON.stringify(responses));
    },
  
    getAnswers() {
      return JSON.parse(localStorage.getItem("userAnswers")) || [];
    },
  
    reset() {
      localStorage.removeItem("quizData");
      localStorage.removeItem("quizProgress");
      localStorage.removeItem("quizScore");
      localStorage.removeItem("userAnswers");
    }
  };
  