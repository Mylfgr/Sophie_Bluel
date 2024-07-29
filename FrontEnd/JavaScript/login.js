// Définition de l'URL de base de l'API
const baseApiUrl = "http://localhost:5678/api/";

// Ajout d'un écouteur d'événement pour le soumission du formulaire
document.addEventListener("submit", (e) => {
  // Empêcher le comportement par défaut du formulaire (qui est de recharger la page)
  e.preventDefault();

  // Récupération des éléments du formulaire (email et password)
  let form = {
    email: document.getElementById("email"), // Champ de l'email
    password: document.getElementById("password"), // Champ du mot de passe
  };

  // Envoi de la requête POST à l'endpoint /users/login de l'API
  fetch(`${baseApiUrl}users/login`, {
    method: "POST", // Méthode HTTP POST
    headers: {
      Accept: "application/json", // Indique que la réponse attendue est en JSON
      "Content-Type": "application/json", // Indique que le corps de la requête est en JSON
    },
    body: JSON.stringify({
      email: form.email.value, // Valeur de l'email du formulaire
      password: form.password.value, // Valeur du mot de passe du formulaire
    }),
  }).then((response) => {
    // Vérification du statut de la réponse
    if (response.status !== 200) {
      // Si le statut n'est pas 200 (OK), afficher une alerte d'erreur
      alert("Email ou mot de passe erronés");
    } else {
      // Si le statut est 200 (OK), extraire le JSON de la réponse
      response.json().then((data) => {
        // Stocker le token reçu dans le sessionStorage
        sessionStorage.setItem("token", data.token);
        // Rediriger vers la page index.html
        window.location.replace("index.html");
      });
    }
  });
});
