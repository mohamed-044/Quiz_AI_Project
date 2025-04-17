export const Storage = {
    // 🔹 Enregistre le quiz complet (questions + réponses correctes)
    saveQuiz(data) {
      localStorage.setItem("quizData", JSON.stringify(data));
    },
  
    // 🔹 Récupère le quiz
    getQuiz() {
      return JSON.parse(localStorage.getItem("quizData")) || [];
    },
  
    // 🔹 Enregistre l'index de la question actuelle
    saveProgress(index) {
      localStorage.setItem("quizProgress", index);
    },
  
    // 🔹 Récupère la progression actuelle (question n°)
    getProgress() {
      return parseInt(localStorage.getItem("quizProgress")) || 0;
    },
  
    // 🔹 Enregistre le score actuel
    saveScore(score) {
      localStorage.setItem("quizScore", score);
    },
  
    // 🔹 Récupère le score
    getScore() {
      return parseInt(localStorage.getItem("quizScore")) || 0;
    },
  
    // 🔹 Enregistre la réponse de l'utilisateur à une question
    saveAnswer(questionIndex, userAnswer) {
      const responses = JSON.parse(localStorage.getItem("userAnswers")) || [];
      responses[questionIndex] = userAnswer;
      localStorage.setItem("userAnswers", JSON.stringify(responses));
    },
  
    // 🔹 Récupère toutes les réponses de l'utilisateur
    getAnswers() {
      return JSON.parse(localStorage.getItem("userAnswers")) || [];
    },
  
    // 🔹 Réinitialise tout (quiz, score, réponses...)
    reset() {
      localStorage.removeItem("quizData");
      localStorage.removeItem("quizProgress");
      localStorage.removeItem("quizScore");
      localStorage.removeItem("userAnswers");
    },
      // 🔹 Save selected language to localStorage
    saveLanguage(language) {
      localStorage.setItem("selectedLanguage", language);
    },

    // 🔹 Get selected language from localStorage
    getLanguage() {
      return localStorage.getItem("selectedLanguage") || "fr";
  
    }
};
  