document.addEventListener("DOMContentLoaded", () => {
    const toggleTheme = document.getElementById("toggle-theme");
    const main = document.querySelector("main");
  
    const currentTheme = localStorage.getItem("theme") || "light";
    if (currentTheme === "dark") {
      main.classList.add("dark-theme");
    }
    toggleTheme.textContent = currentTheme === "dark" ? "☀️" : "🌙";
  
    toggleTheme.addEventListener("click", () => {
      main.classList.toggle("dark-theme");
  
      const isDark = main.classList.contains("dark-theme");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      toggleTheme.textContent = isDark ? "☀️" : "🌙";
    });
  });
  