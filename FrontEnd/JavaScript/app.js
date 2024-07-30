// URL de base pour l'API
const baseApiUrl = "http://localhost:5678/api/";

// Variables globales pour stocker les données des travaux et des catégories
let worksData, categories;
let filter, gallery;
let modal;

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


// MODALE

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const openModalBtn = document.getElementById('openModalBtn');
  const closeBtn = document.querySelector('.closeBtn');
  const photoGallery = document.getElementById('photoGallery');
  const photoInput = document.getElementById('photoInput');
  const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
  const API_URL = 'https://api.example.com/photos'; // Remplacez par votre API

  openModalBtn.addEventListener('click', () => {
      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');
      fetchPhotos();
  });

  closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
  });

  window.addEventListener('click', (event) => {
      if (event.target === modal) {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
      }
  });

  uploadPhotoBtn.addEventListener('click', () => {
      const file = photoInput.files[0];
      if (file) {
          const formData = new FormData();
          formData.append('photo', file);

          fetch(API_URL, {
              method: 'POST',
              body: formData
          })
          .then(response => response.json())
          .then(data => {
              console.log('Success:', data);
              fetchPhotos();
          })
          .catch((error) => {
              console.error('Error:', error);
          });
      }
  });

  function fetchPhotos() {
      fetch(API_URL)
          .then(response => response.json())
          .then(data => {
              photoGallery.innerHTML = '';
              data.forEach(photo => {
                  const img = document.createElement('img');
                  img.src = photo.url;
                  img.alt = 'Photo';
                  img.dataset.id = photo.id;
                  img.addEventListener('click', () => deletePhoto(photo.id));
                  photoGallery.appendChild(img);
              });
          })
          .catch((error) => {
              console.error('Error:', error);
          });
  }

  function deletePhoto(id) {
      fetch(`${API_URL}/${id}`, {
          method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
          console.log('Deleted:', data);
          fetchPhotos();
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  }
});