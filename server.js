const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/generate-quiz', async (req, res) => {
  const { theme, difficulty, questionCount } = req.body;

  if (!theme || !difficulty || !questionCount) {
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }

  if (questionCount > 20) {
    return res.status(400).json({ error: 'Nombre maximal de questions autorisé : 20.' });
  }

  const prompt = `
  Tu dois me retourner un tableau JSON **strictement valide**, contenant exactement ${questionCount} objets.
  
  Chaque objet représente une question du quiz sur le thème **"${theme}"**, niveau **"${difficulty}"**.
  
  Structure de chaque objet :
  {
    "question": "Texte de la question",
    "choices": ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],
    "answer": "Réponse exacte présente dans choices"
  }
  
  ⚠️ Important :
  - Tu dois absolument me retourner **${questionCount}** objets dans le tableau et non un de plus ou un de moins.
  - Ne pas inclure d'explication.
  - Les questions doivent être de plus en plus dur mais rester **"${difficulty}"**.
  - Format = JSON brut, sans commentaire ni texte autour.
  - Génère le JSON le plus vite possible.
  
  Commence maintenant :
  `;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const quizText = response.data.choices[0].message.content;
    res.json({ quiz: quizText });
  } catch (error) {
    console.error('Erreur API OpenAI :', error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur lors de la génération du quiz.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur backend lancé sur http://localhost:${PORT}`);
});