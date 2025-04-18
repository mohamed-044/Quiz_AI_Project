const translateButton = document.getElementById("language-submit");
const loader = document.getElementById("loader");
const quizform = document.getElementById("quiz-form");

console.log("📦 Script de traduction chargé.");

const storedLanguage = localStorage.getItem("selectedLanguage");
if (storedLanguage) {
  document.getElementById("language").value = storedLanguage;
  console.log(`🌍 Langue préremplie depuis localStorage : ${storedLanguage}`);
}

translateButton.addEventListener("click", async function (event) {
  event.preventDefault();

  const language = document.getElementById("language").value.trim().toLowerCase();
  console.log(`🖱️ Bouton cliqué. Langue demandée : ${language}`);

  if (!language) {
    alert("Veuillez entrer une langue valide !");
    console.warn("⚠️ Aucune langue renseignée.");
    return;
  }

  localStorage.setItem("selectedLanguage", language);
  console.log(`💾 Langue enregistrée dans localStorage : ${language}`);

  loader.style.display = "block";
  console.log("⏳ loader affiché.");

  const htmlContent = document.body.innerHTML;
  console.log("📄 Contenu complet de <body> extrait pour traduction.");

  try {
    console.log("🚀 Envoi du contenu au serveur pour traduction...");
    const response = await fetch("http://localhost:3000/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: htmlContent,
        targetLang: language,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Réponse JSON reçue :", data);

    if (data.translated) {
      const parser = new DOMParser();
      const translatedDoc = parser.parseFromString(data.translated, "text/html");

      const translatedBody = translatedDoc.body;
      if (!translatedBody) {
        throw new Error("Impossible de parser le contenu traduit.");
      }

      document.body.innerHTML = translatedBody.innerHTML;
      console.log("🌍 Contenu de <body> remplacé avec le HTML traduit.");
    } else {
      console.error("❌ Donnée 'translated' absente dans la réponse JSON.");
      alert("La traduction a échoué. Veuillez réessayer.");
    }

  } catch (error) {
    console.error("❌ Erreur pendant la traduction :", error);
    alert(`Erreur lors de la traduction : ${error.message}`);

  } 
  finally 
  {
    setTimeout(() => {
      loader.style.display = "none";
      console.log("⏳ Loader caché.");
    }, 500);
    console.log("🔚 Fin du processus.");
  }

});
