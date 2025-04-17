// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const toggleBtn = document.getElementById('toggle-theme');
  
    // Initialisation : charger le thème depuis le localStorage
    const savedTheme = localStorage.getItem('theme');
  
    if (savedTheme === 'dark') {
      body.classList.add('dark-theme');
      if (toggleBtn) toggleBtn.textContent = '☀️ Mode Clair';
    } else {
      body.classList.remove('dark-theme');
      if (toggleBtn) toggleBtn.textContent = '🌙 Mode Sombre';
    }
  
    // Toggle bouton
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
  
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        toggleBtn.textContent = isDark ? '☀️ Mode Clair' : '🌙 Mode Sombre';
      });
    }
  });
  