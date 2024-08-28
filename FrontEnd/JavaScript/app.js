// Déclaration des variables globales
const BASE_API_URL = "http://localhost:5678/api/";
let worksData, categories;

// Fonction exécutée lors du chargement de la fenêtre
window.onload = async () => {
  try {
    worksData = await fetchData(`${BASE_API_URL}works`);
    categories = extractCategories(worksData);
    initializePage();
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
  }
};

// Fonction pour récupérer les données de l'API
const fetchData = async url => {
  const response = await fetch(url);
  return response.json();
};

// Fonction d'initialisation de la page
const initializePage = () => {
  renderGallery(worksData);
  initializeFilters();
  checkAdminMode(); // Mode administrateur
};

// Fonction pour afficher la galerie
const renderGallery = data => {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = data.map(work => `
    <figure class="workCard" data-category="${work.category.name}">
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
    </figure>
  `).join('');
};

// Fonction pour extraire les catégories uniques
const extractCategories = data => {
  const uniqueCategories = new Set(data.map(work => JSON.stringify(work.category)));
  return [...uniqueCategories].map(JSON.parse);
};

// Fonction pour initialiser les filtres
const initializeFilters = () => {
  const filterContainer = document.querySelector(".filter");
  filterContainer.innerHTML = `
    <button class="filterButton" data-category="Tous">Tous</button>
    ${categories.map(cat => `<button class="filterButton" data-category="${cat.name}">${cat.name}</button>`).join('')}
  `;
  addFilterEventListeners();
};

// Fonction pour ajouter les écouteurs d'événements des filtres
const addFilterEventListeners = () => {
  document.querySelectorAll(".filterButton").forEach(button =>
    button.addEventListener("click", () => filterGallery(button.dataset.category))
  );
};

// Fonction pour filtrer les projets
const filterGallery = category => {
  document.querySelectorAll(".workCard").forEach(card => {
    card.style.display = (category === "Tous" || card.dataset.category === category) ? "block" : "none";
  });
};

// Vérifie et active le mode administrateur si nécessaire
const checkAdminMode = () => {
  if (sessionStorage.getItem("token")?.length === 143) {
    activateAdminMode();
  }
};

// Active le mode administrateur
const activateAdminMode = () => {
  document.querySelector(".filter").style.display = "none";
  configureLogoutButton();
  createAdminMenu();
  addAdminEditButtons();
  attachModalEventListener();
};

// Configure le bouton de déconnexion
const configureLogoutButton = () => {
  const logBtn = document.getElementById("logBtn");
  logBtn.innerText = "logout";
  if (!logBtn.classList.contains("logoutConfigured")) {
    logBtn.addEventListener("click", handleLogout);
    logBtn.classList.add("logoutConfigured");
  }
};

// Crée le menu d'administration
const createAdminMenu = () => {
  if (!document.querySelector(".topMenu")) {
    const topMenu = document.createElement("div");
    topMenu.className = "topMenu";
    topMenu.innerHTML = `
      <p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>
      <button>Publier les changements</button>
    `;
    document.body.prepend(topMenu);
  }
};

// Ajoute les boutons de modification
const addAdminEditButtons = () => {
  addEditButton("#introduction img", "afterend");
  addEditButton("#introduction article", "afterbegin");
  addEditButton("#portfolio h2", "afterend");
};

// Ajoute un bouton de modification à un élément
const addEditButton = (selector, position) => {
  const existingButton = document.querySelector(`${selector} + .editBtn`) || document.querySelector(`${selector} .editBtn`);
  if (!existingButton) {
    const editBtnHTML = `<p class="editBtn"><i class="fa-regular fa-pen-to-square"></i>Modifier</p>`;
    document.querySelector(selector).insertAdjacentHTML(position, editBtnHTML);
  }
};

// Attache l'événement d'ouverture de la modale
const attachModalEventListener = () => {
  const portfolioP = document.querySelector("#portfolio p");
  if (!portfolioP.classList.contains("modalConfigured")) {
    portfolioP.addEventListener("click", openModal);
    portfolioP.classList.add("modalConfigured");
  }
};

// Fonction de gestion de la déconnexion
const handleLogout = () => {
  sessionStorage.removeItem("token");
  document.querySelector(".filter").style.display = "block";
  resetLogoutButton();
  removeAdminMenu();
  removeAdminEditButtons();
  detachModalEventListener();
};

// Réinitialise le bouton de déconnexion
const resetLogoutButton = () => {
  const logBtn = document.getElementById("logBtn");
  logBtn.innerText = "login";
  logBtn.removeEventListener("click", handleLogout);
  logBtn.classList.remove("logoutConfigured");
};

// Supprime le menu d'administration
const removeAdminMenu = () => {
  const topMenu = document.querySelector(".topMenu");
  if (topMenu) topMenu.remove();
};

// Supprime les boutons de modification
const removeAdminEditButtons = () => {
  document.querySelectorAll(".editBtn").forEach(btn => btn.remove());
};

// Détache l'événement d'ouverture de la modale
const detachModalEventListener = () => {
  const portfolioP = document.querySelector("#portfolio p");
  if (portfolioP.classList.contains("modalConfigured")) {
    portfolioP.removeEventListener("click", openModal);
    portfolioP.classList.remove("modalConfigured");
  }
};

// Ouvre la modale
const openModal = () => {
  if (sessionStorage.getItem("token")?.length === 143) {
    const modal = document.querySelector(".modal");
    modal.style.display = "flex";
    document.querySelector("#addPicture").style.display = "none";
    document.querySelector("#editGallery").style.display = "flex";
    renderModalGallery(worksData);
    modalStep = 0;
    modal.addEventListener("click", handleModalClose);
    document.addEventListener("click", handleDeleteButton);
    document.addEventListener("click", handleNewWorkFormOpen);
  }
};

// Ferme la modale
const handleModalClose = e => {
  if (e.target === document.querySelector(".modal") || e.target === document.querySelector(".modalHeader .fa-xmark")) {
    document.querySelector(".modal").style.display = "none";
    document.removeEventListener("click", handleModalClose);
    document.removeEventListener("click", handleDeleteButton);
    modalStep = null;
  }
};

// Affiche la galerie dans la modale
const renderModalGallery = data => {
  const modalContent = document.querySelector(".modalContent");
  modalContent.innerHTML = data.map(work => `
    <figure class="miniWork">
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>éditer</figcaption>
      <i id="${work.id}" class="fa-solid fa-trash-can"></i>
    </figure>
  `).join('');
};

// Gère les clics sur les boutons de suppression
const handleDeleteButton = e => {
  if (e.target.classList.contains("fa-trash-can")) {
    deleteWork(e.target.id);
  }
};

// Supprime un travail
const deleteWork = async id => {
  const response = await fetch(`${BASE_API_URL}works/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
  });

  if (response.ok) {
    alert("Projet supprimé avec succès");
    worksData = worksData.filter(work => work.id !== id);
    renderGallery(worksData);
    renderModalGallery(worksData);
  } else {
    alert(`Erreur : ${response.status}`);
    handleModalClose();
  }
};

// Gère l'ouverture du formulaire de nouveau travail
const handleNewWorkFormOpen = e => {
  if (e.target.matches("#addPictureBtn")) {
    modalStep = 1;
    document.querySelector("#addPicture").style.display = "flex";
    document.querySelector("#editGallery").style.display = "none";
    document.querySelector("#labelPhoto").style.display = "flex";
    document.querySelector("#picturePreview").style.display = "none";
    document.querySelector("#valider").style.backgroundColor = "#A7A7A7";
    document.querySelector("#addPictureForm").reset();
    populateCategorySelect();
    pictureInput = document.querySelector("#photo");
    pictureInput.addEventListener("change", previewPicture);
    document.querySelector("#addPictureForm").addEventListener("change", updateSubmitButtonColor);
    document.querySelector(".modalHeader .fa-arrow-left").addEventListener("click", openModal);
    document.removeEventListener("click", handleNewWorkFormOpen);
    document.removeEventListener("click", handleDeleteButton);
    document.addEventListener("click", handleNewWorkSubmit);
  }
};

// Remplit le select des catégories
const populateCategorySelect = () => {
  const categorySelect = document.querySelector("#categorySelect");
  categorySelect.innerHTML = categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
};

// Affiche l'aperçu de l'image
const previewPicture = () => {
  const file = pictureInput.files[0];
  const reader = new FileReader();
  
  reader.onload = e => {
    const preview = document.querySelector("#picturePreview");
    preview.src = e.target.result;
    document.querySelector("#labelPhoto").style.display = "none";
    preview.style.display = "flex";
    document.querySelector("#valider").style.backgroundColor = "#1D6154";
  };
  
  reader.readAsDataURL(file);
};

// Met à jour la couleur du bouton de soumission
const updateSubmitButtonColor = () => {
  document.querySelector("#valider").style.backgroundColor = "#1D6154";
};

// Soumet le formulaire de nouveau travail
const handleNewWorkSubmit = e => {
  if (e.target.matches("#valider")) {
    e.preventDefault();
    submitNewWork();
  }
};

// Soumet un nouveau travail
const submitNewWork = async () => {
  const formData = new FormData(document.querySelector("#addPictureForm"));
  try {
    const response = await fetch(`${BASE_API_URL}works`, {
      method: "POST",
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      body: formData,
    });
    const result = await response.json();
    worksData.push(result);
    renderModalGallery(worksData);
    renderGallery(worksData);
    alert("Projet ajouté avec succès");
    handleModalClose();
  } catch (error) {
    console.error("Erreur lors de l'ajout du projet :", error);
  }
};
