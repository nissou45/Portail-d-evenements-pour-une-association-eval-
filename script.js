//--------------------------------------------------
// SÉLECTION DES ÉLÉMENTS
//--------------------------------------------------
const conteneurEvenements = document.getElementById("conteneur-evenements");
const conteneurPlanning = document.getElementById("conteneur-planning");

// Modale
const modale = document.getElementById("modale");
const fermerModale = document.getElementById("fermer-modale");
const modaleTitre = document.getElementById("modale-titre");
const modaleDescription = document.getElementById("modale-description");
const modaleDate = document.getElementById("modale-date");
const modaleLieu = document.getElementById("modale-lieu");
const modaleLien = document.getElementById("modale-lien");
const zoneBouton = document.getElementById("zone-bouton-modale");

// Thème
const boutonTheme = document.getElementById("bouton-theme");

// API
const urlAPI =
  "https://demo.theeventscalendar.com/wp-json/tribe/events/v1/events";

let planning = [];
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // jours → millisecondes
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
  const cookies = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookies ? cookies.split("=")[1] : null;
}
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // jours → millisecondes
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
  const cookies = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookies ? cookies.split("=")[1] : null;
}

//--------------------------------------------------
// CHARGER LES ÉVÈNEMENTS
//--------------------------------------------------

async function chargerEvenements() {
  const rep = await fetch(urlAPI);
  const data = await rep.json();
  afficherEvenements(data.events);
}

function afficherEvenements(liste) {
  conteneurEvenements.innerHTML = "";

  liste.forEach((ev) => {
    const carte = document.createElement("div");
    carte.classList.add("carte-evenement");

    carte.innerHTML = `
      <h3>${ev.title}</h3>
      <p>Date : ${ev.start_date}</p>
      <p>Lieu : ${ev.venue ? ev.venue.address : "Non renseigné"}</p>
      <button class="btn-details">Voir détails</button>
    `;

    carte.querySelector("button").addEventListener("click", () => {
      ouvrirModale(ev);
    });

    conteneurEvenements.appendChild(carte);
  });
}

//--------------------------------------------------
// MODALE
//--------------------------------------------------

function ouvrirModale(event) {
  modale.classList.remove("cachee");

  modaleTitre.textContent = event.title;
  modaleDescription.textContent = event.description || "Aucune description.";
  modaleDate.textContent = "Date : " + event.start_date;
  modaleLieu.textContent =
    "Lieu : " + (event.venue ? event.venue.address : "Non renseigné");
  modaleLien.href = event.url;

  zoneBouton.innerHTML = "";

  const deja = planning.some((ev) => ev.id === event.id);

  const btn = document.createElement("button");
  btn.classList.add("btn-details");
  btn.textContent = deja ? "Retirer du planning" : "Ajouter au planning";

  btn.addEventListener("click", () => {
    if (deja) {
      retirerDuPlanning(event.id);
    } else {
      ajouterAuPlanning(event);
    }
    fermerLaModale();
  });

  zoneBouton.appendChild(btn);
}

function fermerLaModale() {
  modale.classList.add("cachee");
}

fermerModale.addEventListener("click", fermerLaModale);

//--------------------------------------------------
// PLANNING
//--------------------------------------------------

function ajouterAuPlanning(event) {
  if (!planning.some((ev) => ev.id === event.id)) {
    planning.push({
      id: event.id,
      titre: event.title,
      date: event.start_date,
      lieu: event.venue ? event.venue.address : "Non renseigné",
    });
  }
  sauvegarder();
  afficherPlanning();
}

function retirerDuPlanning(id) {
  planning = planning.filter((ev) => ev.id !== id);
  sauvegarder();
  afficherPlanning();
}

function afficherPlanning() {
  conteneurPlanning.innerHTML = "";

  planning.forEach((ev) => {
    const bloc = document.createElement("div");
    bloc.classList.add("carte-evenement");

    bloc.innerHTML = `
      <h4>${ev.titre}</h4>
      <p>${ev.date}</p>
      <p>${ev.lieu}</p>
    `;

    conteneurPlanning.appendChild(bloc);
  });
}

//--------------------------------------------------
// LOCALSTORAGE
//--------------------------------------------------

function sauvegarder() {
  localStorage.setItem("planning", JSON.stringify(planning));
}

function chargerPlanning() {
  planning = JSON.parse(localStorage.getItem("planning")) || [];
  afficherPlanning();
}

//--------------------------------------------------
// MODE SOMBRE
//--------------------------------------------------

boutonTheme.addEventListener("click", () => {
  document.body.classList.toggle("theme-sombre");

  const themeActuel = document.body.classList.contains("theme-sombre")
    ? "sombre"
    : "clair";

  // Sauvegarde pendant 1 an
  setCookie("theme", themeActuel, 365);

  boutonTheme.textContent =
    themeActuel === "sombre" ? "Mode clair" : "Mode sombre";
});

//--------------------------------------------------
// INIT
//--------------------------------------------------

chargerEvenements();
chargerPlanning();
