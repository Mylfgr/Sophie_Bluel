// Définition de l'URL de base de l'API
const baseApiUrl = "http://localhost:5678/api/";

// Fonction pour gérer la connexion
const handleLogin = (e) => {
  e.preventDefault(); // Empêcher le comportement par défaut du formulaire (rechargement de la page)

  // Récupérer les éléments du formulaire
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Envoyer la requête de connexion
  fetch(`${baseApiUrl}users/login`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
  .then(response => {
    if (response.ok) {
      return response.json(); // Extraire le JSON de la réponse
    } else {
      throw new Error("Email ou mot de passe erronés"); // Gérer les erreurs
    }
  })
  .then(data => {
    sessionStorage.setItem("token", data.token); // Stocker le token
    window.location.replace("index.html"); // Rediriger vers la page d'accueil
  })
  .catch(error => {
    alert(error.message); // Afficher l'erreur
  });
};

// Attacher l'écouteur d'événement au formulaire
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");
  if (form) {
    form.addEventListener("submit", handleLogin); // Ajouter l'écouteur d'événement
  } else {
    console.error("Le formulaire n'a pas été trouvé");
  }
});
