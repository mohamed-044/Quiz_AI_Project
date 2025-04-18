// Assurez-vous que vous avez défini l'URL de votre API backend et la clé d'API dans le fichier .env
const apiUrl = 'http://localhost:3000/api/generate-images'; // Changez avec l'URL de votre serveur
const questionElement = document.getElementById('question'); // La question sera ajoutée ici
const imageContainer = document.getElementById('imageContainer');
const answersForm = document.getElementById('answersForm');
const submitButton = document.getElementById('submitAnswer');

// Fonction pour générer des images avec l'API backend
async function generateImages() {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: 'Ville de Oran', // Exemple de prompt, à ajuster en fonction du contexte
                numberOfImages: 4 // Nombre d'images à générer
            })
        });

        // Log de la réponse brute pour diagnostiquer le problème
        const responseText = await response.text();
        console.log('Réponse brute du serveur:', responseText);

        // Tentative de parsing JSON après avoir loggé la réponse
        const data = JSON.parse(responseText);

        if (response.ok) {
            const images = data.images; // Vous devez renvoyer les URLs d'images depuis le serveur
            images.forEach((image, index) => {
                const imgElement = document.createElement('img');
                imgElement.src = image.url;
                imgElement.alt = `Image ${index + 1}`;
                imageContainer.appendChild(imgElement);
            });
        } else {
            console.error('Erreur lors de la génération des images:', data);
            alert('Impossible de générer les images.');
        }
    } catch (error) {
        console.error('Erreur lors de la communication avec le serveur:', error);
        alert('Erreur de connexion au serveur.');
    }
}

// Fonction pour valider la réponse
submitButton.addEventListener('click', () => {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');

    if (!selectedAnswer) {
        alert('Veuillez sélectionner une réponse');
        return;
    }

    const userAnswer = selectedAnswer.value;
    console.log('Réponse de l\'utilisateur:', userAnswer);

    // Ajouter ici le code pour traiter la réponse (par exemple, vérifier si elle est correcte)

    alert(`Vous avez choisi : ${userAnswer}`);
});

// Charger la première question et les images
window.onload = () => {
    generateImages();
};
