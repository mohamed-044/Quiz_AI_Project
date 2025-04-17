// Thème par défaut (clair)
const body = document.body;
const themeToggleBtn = document.getElementById('toggle-theme');

// Charger le thème depuis le localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-theme');
  themeToggleBtn.textContent = '☀️ Mode Clair';
} else {
  themeToggleBtn.textContent = '🌙 Mode Sombre';
}

// Toggle
themeToggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-theme');

  const isDark = body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggleBtn.textContent = isDark ? '☀️ Mode Clair' : '🌙 Mode Sombre';
});
