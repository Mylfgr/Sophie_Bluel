// URL de base pour l'API
const baseApiUrl = "http://localhost:5678/api/";

// Variables globales pour stocker les données des travaux et des catégories
let worksData, categories;
let filter, gallery;

// Fonction exécutée au chargement de la fenêtre
window.onload = async () => {
  try {
    // Récupération des données des travaux depuis l'API
    worksData = await fetchData(`${baseApiUrl}works`);
    // Extraction des catégories uniques à partir des données des travaux
    categories = getUniqueCategories(worksData);
    // Initialisation de la page avec les données récupérées
    initPage();
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

// Fonction pour récupérer des données à partir d'une URL
const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

// Fonction pour initialiser la page
const initPage = () => {
  // Affichage de la galerie avec les données des travaux
  displayGallery(worksData);
  // Sélection de l'élément filtre dans le DOM
  filter = document.querySelector(".filter");
  // Initialisation des boutons de filtre avec les catégories uniques
  initFilter(filter, categories);
  // Mode administrateur (fonction présumée définie ailleurs)
  adminUserMode(filter); 
};

// Fonction pour afficher la galerie
const displayGallery = (data) => {
  // Sélection de l'élément galerie dans le DOM
  gallery = document.querySelector(".gallery");
  // Génération et insertion du HTML pour chaque travail dans la galerie
  gallery.innerHTML = data.map(work => `
    <figure class="workCard" data-category="${work.category.name}">
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
    </figure>
  `).join('');
};

// Fonction pour obtenir des catégories uniques à partir des données des travaux
const getUniqueCategories = (data) => {
  // Utilisation d'un Set pour s'assurer que chaque catégorie est unique
  return [...new Set(data.map(work => JSON.stringify(work.category)))].map(JSON.parse);
};

// Fonction pour initialiser les boutons de filtre
const initFilter = (filter, categories) => {
  // Génération et insertion du bouton "Tous" et des boutons de catégories
  filter.innerHTML = `<button class="filterButton" data-category="Tous">Tous</button>` +
                     categories.map(cat => `
                       <button class="filterButton" data-category="${cat.name}">${cat.name}</button>
                     `).join('');
  // Ajout des écouteurs d'événements sur les boutons de filtre
  addFilterListeners();
};

// Fonction pour ajouter des écouteurs d'événements sur les boutons de filtre
const addFilterListeners = () => {
  // Sélection de tous les boutons de filtre et ajout d'un écouteur de clic
  document.querySelectorAll(".filterButton").forEach(button => {
    button.addEventListener("click", () => {
      // Filtrage des projets en fonction de la catégorie du bouton cliqué
      toggleProjects(button.dataset.category);
    });
  });
};

// Fonction pour afficher/masquer les projets en fonction de la catégorie sélectionnée
const toggleProjects = (category) => {
  // Sélection de toutes les cartes de travail
  document.querySelectorAll(".workCard").forEach(figure => {
    // Affichage de toutes les cartes si la catégorie est "Tous", sinon affichage des cartes correspondant à la catégorie sélectionnée
    figure.style.display = category === "Tous" || figure.dataset.category === category ? "block" : "none";
  });
};