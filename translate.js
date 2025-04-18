const translateButton = document.getElementById("language-submit");
const loader = document.getElementById("loader");
const quizform = document.getElementById("quiz-form");

const storedLanguage = localStorage.getItem("selectedLanguage");
if (storedLanguage) {
  document.getElementById("language").value = storedLanguage; // Pre-fill the input with the saved language
}

translateButton.addEventListener("click", async function () {
  const language = document.getElementById("language").value.trim().toLowerCase();

  if (!language) {
    alert("Please enter a valid language!");
    return;
  }

  localStorage.setItem("selectedLanguage", language);

  quizform.style.display = "none";
  loader.style.display = "block";

  const htmlContent = document.body.innerHTML;

  try {
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

    // Check if the response status is OK (200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Check if the response is JSON
    const contentType = response.headers.get("Content-Type");
    console.log("Content-Type:", contentType);

    // Log the response body to check what the server is returning
    const responseText = await response.text();  // Get the response as text
    console.log("Response Text:", responseText);  // Log for troubleshooting

    // Check if the response is JSON
    if (contentType && contentType.includes("application/json")) {
      const data = JSON.parse(responseText);  // Parse response explicitly

      if (data.translated) {
        // If the translation was successful, replace the page's content with the translated HTML
        document.body.innerHTML = data.translated;
      } else {
        alert("Translation failed. Please try again.");
      }
    } else {
      alert(`Unexpected response format. Expected JSON. Response was: ${responseText}`);
    }
  } catch (error) {
    console.error("Error during translation:", error);
    alert(`An error occurred while translating the page: ${error.message}`);
  } finally {
    loader.style.display = "none";
    quizform.style.display = "block";
  }
});
