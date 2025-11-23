// Je récupère la div où vont être affichées les cartes d’événements
const conteneurEvenements = document.getElementById("conteneur-evenements");
// Je récupère la div où seront affichés les événements ajoutés au planning
const conteneurPlanning = document.getElementById("conteneur-planning");
// Je récupère l’élément global de la modale
const modale = document.getElementById("modale");
// Je récupère la croix qui ferme la modale
const fermerModale = document.getElementById("fermer-modale");
// Je récupère le titre de la modale
const modaleTitre = document.getElementById("modale-titre");
// Je récupère la description de la modale
const modaleDescription = document.getElementById("modale-description");
// Je récupère la date dans la modale
const modaleDate = document.getElementById("modale-date");
// Je récupère le lieu dans la modale
const modaleLieu = document.getElementById("modale-lieu");
// Je récupère le lien "Voir plus"
const modaleLien = document.getElementById("modale-lien");
// Je récupère la zone où sera ajouté le bouton Ajouter/Retirer
const zoneBouton = document.getElementById("zone-bouton-modale");
// Je récupère le bouton du mode sombre
const boutonTheme = document.getElementById("bouton-theme");

// URL officielle fournie dans la consigne
const urlAPI =
  "https://demo.theeventscalendar.com/wp-json/tribe/events/v1/events";

// Je crée un tableau vide qui stockera les événements du planning
let planning = [];

// Fonction qui sauvegarde le thème dans un cookie pendant 1 an
function sauvegarderTheme(theme) {
  document.cookie = "theme=" + theme + "; max-age=31536000; path=/";
}

// Fonction qui lit la valeur d’un cookie selon son nom
function getCookie(name) {
  // Je crée une fonction qui s'appelle getCookie et qui reçoit un nom de cookie à chercher

  const cookies = document.cookie
    // Je récupère TOUS les cookies du site dans une seule grande chaîne de texte

    .split("; ")
    // Je coupe cette chaîne en petits morceaux à chaque "; "
    //  chaque élément du tableau représente un cookie individuel

    .find((c) => c.startsWith(name + "="));
  // Je cherche dans ce tableau l’élément qui commence par "name="
  // Si je le trouve : je récupère le cookie qui correspond
  // Si je ne trouve rien : ça retourne undefined

  return cookies ? cookies.split("=")[1] : null;
  // Si un cookie a été trouvé → je coupe encore une fois le texte avec "="
  // Exp: "theme=sombre"
  // split("=") donne ["theme", "sombre"]
  // Je prends donc la valeur → [1]
  // Si aucun cookie n’a été trouvé → je renvoie null
}

// Fonction asynchrone qui charge les événements depuis l’API
async function chargerEvenements() {
  // Je déclare une fonction asynchrone, ce qui me permet d'utiliser "await" à l'intérieur.

  console.log(" Je contacte l'API :", urlAPI);
  // J'affiche dans la console un message pour vérifier que la fonction se lance bien
  // et pour montrer l'URL exacte que je vais appeler.

  const rep = await fetch(urlAPI);
  // Je fais une requête HTTP vers l'API avec "fetch".
  // "await" signifie que JavaScript attend la réponse avant de continuer.
  // La variable "rep" contient la réponse brute envoyée par le serveur.
  console.log(" Réponse brute de l'API :", rep);
  // J'affiche la réponse brute pour voir si l'API a bien répondu
  // et vérifier les informations (statut, headers, etc.)
  // Je vérifie si la réponse est correcte
  if (!rep.ok) {
    console.error(" Erreur API :", rep.status, rep.statusText);
    alert(
      "Impossible de charger les événements. Veuillez réessayer plus tard."
    );
    return; // J'arrête la fonction pour éviter un crash
  }

  const data = await rep.json();
  // La réponse reçue est en format JSON (texte).
  // rep.json() transforme le texte JSON en un vrai objet JavaScript.
  // "await" attend la fin de cette conversion.

  console.log(" Données JSON reçues :", data);
  // J'affiche les données converties pour vérifier qu'elles sont correctes
  // et comprendre la structure (data.events, data.total, etc.).

  afficherEvenements(data.events);
  // J'appelle ma fonction "afficherEvenements" pour envoyer la liste des événements
  // afin de créer les cartes et les afficher sur la page.
}

// Fonction qui crée et affiche les cartes d’événements
function afficherEvenements(liste) {
  console.log(" J'affiche les événements :", liste);

  conteneurEvenements.innerHTML = ""; // Je vide la zone avant d’ajouter

  liste.forEach((ev) => {
    // Je parcours chaque événement

    const carte = document.createElement("div"); // Je crée une carte
    carte.classList.add("carte-evenement"); // J’ajoute la classe CSS

    const titre = document.createElement("h3"); // Je crée un titre
    titre.textContent = ev.title; // J’ajoute le texte
    carte.appendChild(titre); // J’ajoute au DOM

    const date = document.createElement("p"); // Je crée la date
    date.textContent = "Date : " + ev.start_date;
    carte.appendChild(date);

    const lieu = document.createElement("p"); // Je crée le lieu
    if (ev.venue) {
      lieu.textContent = "Lieu : " + ev.venue.address;
    } else {
      lieu.textContent = "Lieu : Non renseigné";
    }
    carte.appendChild(lieu);

    const zoneBoutons = document.createElement("div"); // Zone des deux boutons
    zoneBoutons.classList.add("boutons-carte");

    const btnDetails = document.createElement("button"); // Bouton Voir détails
    btnDetails.classList.add("btn-details");
    btnDetails.textContent = "Voir détails";
    btnDetails.addEventListener("click", () => {
      ouvrirModale(ev); // J’ouvre la modale avec l’événement cliqué
    });
    zoneBoutons.appendChild(btnDetails);

    const btnAjouter = document.createElement("button"); // Bouton Ajouter
    btnAjouter.classList.add("btn-ajout");
    btnAjouter.textContent = "Ajouter";
    btnAjouter.addEventListener("click", () => {
      ajouterAuPlanning(ev); // J’ajoute au planning
    });
    zoneBoutons.appendChild(btnAjouter);

    carte.appendChild(zoneBoutons); // J’ajoute les deux boutons à la carte

    conteneurEvenements.appendChild(carte); // J’ajoute la carte au DOM
  });
}

// Fonction qui ouvre la modale
function ouvrirModale(event) {
  console.log(" J'ouvre la modale pour :", event);

  modale.classList.remove("cachee"); // J’affiche la modale
  modaleTitre.textContent = event.title; // Je mets le titre
  modaleDescription.textContent = event.description || "Aucune description.";
  modaleDate.textContent = "Date : " + event.start_date;
  modaleLieu.textContent =
    "Lieu : " + (event.venue ? event.venue.address : "Non renseigné");
  modaleLien.href = event.url; // Je mets le lien

  zoneBouton.innerHTML = ""; // Je vide l’ancienne zone bouton

  const deja = planning.some((ev) => ev.id === event.id); // Vérif présence planning

  const btn = document.createElement("button"); // Bouton dynamique
  btn.classList.add("btn-details");
  btn.textContent = deja ? "Retirer du planning" : "Ajouter au planning";

  btn.addEventListener("click", () => {
    if (deja) retirerDuPlanning(event.id);
    else ajouterAuPlanning(event);

    fermerLaModale(); // Je ferme la modale après action
  });

  zoneBouton.appendChild(btn); // J’ajoute le bouton à la modale
}

// Fonction qui ferme la modale
function fermerLaModale() {
  modale.classList.add("cachee");
}

fermerModale.addEventListener("click", fermerLaModale);

// Fonction qui ajoute un événement dans le planning
function ajouterAuPlanning(event) {
  // Je crée une fonction,elle reçoit en paramètre l'événement que l'utilisateur veut ajouter.

  console.log(" Tentative d'ajout :", event);
  // J'affiche dans la console l'événement que je suis en train d'essayer d'ajouter
  // Cela m'aide à vérifier que je reçois bien les bonnes données.

  if (!planning.some((ev) => ev.id === event.id)) {
    // Je vérifie si cet événement existe déjà dans mon tableau "planning".
    // .some() retourne true si un événement avec le même id existe.
    // Ici je mets "!" pour dire : SI l'événement N'EST PAS déjà dans le planning…

    planning.push({
      // Alors je l'ajoute dans mon tableau "planning" avec push()

      id: event.id,
      // Je stocke l'identifiant unique de l'événement

      titre: event.title,
      // Je stocke le titre de l'événement

      date: event.start_date,
      // Je stocke la date de l'événement

      lieu: event.venue ? event.venue.address : "Non renseigné",
      // Si l'événement contient un lieu :je récupère l'adresse Sinon → j'indique "Non renseigné"
    });
  }

  sauvegarder();
  // J'appelle la fonction "sauvegarder" qui enregistre le planning dans localStorage.
  // Grâce à ça, le planning reste même si on recharge la page.

  afficherPlanning();
  // J'appelle la fonction qui réaffiche le planning à l'écran
  // pour que l'utilisateur voie immédiatement le nouvel événement ajouté.
}

// Fonction qui retire un événement du planning
function retirerDuPlanning(id) {
  // Je crée une nouvelle version du tableau "planning"
  // en gardant seulement les événements dont l'id est différent
  // de celui qu'on veut retirer.
  //  Donc celui qui a l'id égal sera supprimé.
  planning = planning.filter((ev) => ev.id !== id);

  sauvegarder();
  // Je sauvegarde le nouveau planning (mis à jour)
  // dans le localStorage, pour garder la modification même après rechargement.

  afficherPlanning();
  // Je réaffiche toute la liste du planning
  // pour mettre à jour visuellement la page.
}

// Fonction qui affiche le planning
function afficherPlanning() {
  console.log(" Mise à jour de l'affichage du planning :", planning);

  // Je vide la zone avant de tout reconstruire
  conteneurPlanning.innerHTML = "";

  // Je parcours chaque événement du planning
  planning.forEach((ev) => {
    console.log(" Affichage de l'événement du planning :", ev);

    // Je crée la carte
    const bloc = document.createElement("div");
    bloc.classList.add("carte-evenement");

    //  Titre
    const titre = document.createElement("h4");
    titre.textContent = ev.titre;
    bloc.appendChild(titre);

    //  Date
    const date = document.createElement("p");
    date.textContent = ev.date;
    bloc.appendChild(date);

    // Lieu
    const lieu = document.createElement("p");
    lieu.textContent = ev.lieu;
    bloc.appendChild(lieu);

    //  Bouton Retirer
    const bouton = document.createElement("button");
    bouton.classList.add("btn-retirer");
    bouton.textContent = "Retirer";

    bouton.addEventListener("click", () => {
      console.log(" Retrait depuis la section planning :", ev.id);
      retirerDuPlanning(ev.id);
    });

    bloc.appendChild(bouton);

    // J'ajoute la carte complète dans le planning
    conteneurPlanning.appendChild(bloc);
  });
}
// Je crée une fonction appelée "sauvegarder",Elle va enregistrer mon tableau planning dans le localStorage.
function sauvegarder() {
  // localStorage.setItem() permet de stocker une donnée dans le navigateur.
  // Le premier argument "planning" est le nom sous lequel je vais la stocker.
  // Le second argument doit être du texte : je transforme donc mon tableau
  // en chaîne JSON grâce à JSON.stringify().
  localStorage.setItem("planning", JSON.stringify(planning));
}

// Je crée une fonction appelée "chargerPlanning",
//  Elle va récupérer le planning stocké dans le localStorage au chargement de la page.
function chargerPlanning() {
  // Je récupère la valeur stockée sous la clé "planning" dans le localStorage.
  // localStorage.getItem("planning") renvoie du texte (string) ou null si rien n’est sauvegardé.
  // JSON.parse() transforme cette chaîne en tableau JavaScript.
  // Si aucune donnée n'est trouvée (null), j’utilise || [] pour créer un tableau vide à la place.
  planning = JSON.parse(localStorage.getItem("planning")) || [];

  // Une fois le planning récupéré, j’appelle afficherPlanning()
  // pour reconstruire l’affichage dans la colonne de droite.
  afficherPlanning();
}

// Mode sombre avec cookie

boutonTheme.addEventListener("click", () => {
  // Je bascule la classe
  document.body.classList.toggle("theme-sombre");

  // Condition classique
  if (document.body.classList.contains("theme-sombre")) {
    boutonTheme.textContent = "Mode clair";
    sauvegarderTheme("sombre");
  } else {
    boutonTheme.textContent = "Mode sombre";
    sauvegarderTheme("clair");
  }
});
// Je récupère la valeur du cookie "theme" grâce à ma fonction getCookie().
// Ce cookie peut contenir "sombre", "clair" ou être null si rien n’a été enregistré.
const themeSauvegarde = getCookie("theme");

// Je vérifie si le thème sauvegardé est égal à "sombre".
if (themeSauvegarde === "sombre") {
  // Si oui : j'ajoute la classe "theme-sombre" au body
  // pour appliquer tout le style du mode sombre défini dans le CSS.
  document.body.classList.add("theme-sombre");

  // Je change aussi le texte du bouton pour qu’il corresponde au bon état :
  // si le thème est sombre, alors le bouton doit afficher "Mode clair".
  boutonTheme.textContent = "Mode clair";
}

// Au chargement du script, j'appelle la fonction chargerEvenements().
// Elle contacte l'API, récupère les événements et les affiche dans la colonne de gauche.
chargerEvenements();

// J'appelle ensuite chargerPlanning().
// Cette fonction récupère le planning sauvegardé dans le localStorage
// et affiche les événements déjà ajoutés dans la colonne de droite.
// Cela permet de garder le planning même après avoir fermé la page.
chargerPlanning();
