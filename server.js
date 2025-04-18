const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

console.log('✅ Middleware CORS et JSON activés.');

// Route de health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Le serveur est en cours d\'exécution' });
});

app.post('/generate-rush', async (req, res) => {
  console.log('📩 Requête reçue sur /generate-rush');
  const { theme, difficulty, questionCount } = req.body;
  console.log('🔍 Corps de la requête :', req.body);

  if (!theme || !difficulty || !questionCount) {
    console.warn('⚠️ Champs manquants dans la requête.');
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }
  console.log('Nombre de questions inutilisé')

  const prompt = `
  Tu dois me retourner un tableau JSON **strictement valide**, contenant exactement 10 objets.
  
  Chaque objet représente une question du quiz sur le thème **"${theme}"**, niveau **"${difficulty}"**.
  
  Structure de chaque objet :
  {
    "question": "Texte de la question",
    "choices": ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],
    "answer": "Réponse exacte présente dans choices"
  }
  
  ⚠️ Important :
  - Tu dois absolument me retourner 10 objets dans le tableau et non un de plus ou un de moins.
  - Ne pas inclure d'explication.
  - Les questions doivent être de plus en plus dur mais rester **"${difficulty}"**.
  - Je te demanderai à nouveau de regénérer des questions plus tard, il faudra augmenter la difficulté à chaque fois.
  - Format = JSON brut, sans commentaire ni texte autour.
  - Génère le JSON le plus vite possible.
  
  Commence maintenant :
  `;

  try {
    console.log('🧠 Envoi du prompt rush à OpenAI...');
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
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
    console.log('✅ Réponse reçue de GPT pour le rush.');
    const quizText = response.data.choices[0].message.content;
    res.json({ quiz: quizText });
  } catch (error) {
    console.error('❌ Erreur API OpenAI :', error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur lors de la génération du rush.' });
  }
});

app.post('/generate-quiz', async (req, res) => {
  console.log('📩 Requête reçue sur /generate-quiz');
  const { theme, difficulty, questionCount } = req.body;
  console.log('🔍 Corps de la requête :', req.body);

  if (!theme || !difficulty || !questionCount) {
    console.warn('⚠️ Champs manquants dans la requête.');
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }

  if (questionCount > 20) {
    console.warn('⚠️ Trop de questions demandées.');
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
    console.log('🧠 Envoi du prompt quiz à OpenAI...');
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
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

    console.log('✅ Réponse reçue de GPT pour le quiz.');
    const quizText = response.data.choices[0].message.content;
    res.json({ quiz: quizText });
  } catch (error) {
    console.error('❌ Erreur API OpenAI :', error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur lors de la génération du quiz.' });
  }
});

app.post('/translate', async (req, res) => {
  console.log('📩 Requête reçue sur /translate');
  console.log('🔍 Corps de la requête :', req.body);
  const { text, targetLang } = req.body;

  try {
    console.log('🌍 Début du processus de traduction...');
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{
          role: 'user',
          content: `Traduisez le texte suivant en ${targetLang} tout en préservant les balises HTML et la structure :\n\n${text}`,
        }],
        temperature: 0.3,
        max_tokens: 2000,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Réponse reçue de GPT pour la traduction.');
    const translatedText = response.data.choices[0].message.content;

    res.json({ translated: translatedText });
  } catch (error) {
    console.error('❌ Erreur de traduction :', error.response?.data || error.message);
    
    if (error.response) {
      console.error('📉 Réponse d\'erreur OpenAI :', error.response.data);
    }

    res.status(500).json({ error: 'Échec de la traduction du contenu.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur backend en ligne sur : http://localhost:${PORT}`);
});
