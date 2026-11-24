//Nous récupérons les éléments HTML grâce à la méthode getElementById() afin que JavaScript puisse les sélectionner
const form = document.getElementById("form");
const nomInput= document.getElementById("nom");
const prenomInput = document.getElementById("prenom");
const emailInput = document.getElementById("email");
const classeInput = document.getElementById("classe");
const noteInput= document.getElementById("note");
const boutonAjouter = document.getElementById("btn");
const listeEtudiants = document.getElementById("listeEtudiants");
const recherche = document.getElementById("recherche");
const messageSucces = document.getElementById("messageSucces");
const totalEtudiants = document.getElementById("totalEtudiants");
const moyenneGenerale = document.getElementById("moyenneGenerale");
const etudiantsAdmis = document.getElementById("etudiantsAdmis");

// Lorsque l'utilisateur clique sur le bouton « Ajouter »,
// les informations de l'étudiant doivent être conservées.
// Pour cela, nous allons créer un tableau JavaScript
// destiné à contenir tous les étudiants.

// Nous récupérons les étudiants précédemment enregistrés
// dans le localStorage. Si aucune donnée n'existe,
// nous initialisons un tableau vide.
let etudiants =JSON.parse(localStorage.getItem("etudiants")) || [];
// Au depart aucune modification n'a eu lieu
// null indique que la variable va changer
let tableauModifier = null ;

// Initialisation des statistiques.
totalEtudiants.textContent = 0 ;
moyenneGenerale.textContent = "0 / 20" ;
etudiantsAdmis.textContent = 0 ;


// 1. MISE À JOUR DES STATISTIQUES

function mettreAJourStatistiques() {

    // Mise à jour du nombre total d'étudiants.
    totalEtudiants.textContent = etudiants.length;

    // Calcul de la somme des notes.
    let sommeNotes = 0;

    etudiants.forEach(function(etudiant) {
        sommeNotes += Number(etudiant.note);
    });

    // Calcul de la moyenne générale.
    let moyenne = 0;

    if (etudiants.length > 0) {
        moyenne = sommeNotes / etudiants.length;
    }

    moyenneGenerale.textContent = moyenne.toFixed(2) + " / 20";

    // Calcul du nombre d'étudiants admis.
    let admis = 0;

    etudiants.forEach(function(etudiant) {
        if (Number(etudiant.note) >= 10) {
            admis++;
        }
    });

    etudiantsAdmis.textContent = admis;
}
// Fonction pour afficher les étudiants sauvegardés
function afficherEtudiantsSauvegardes() {

    // On parcourt le tableau des étudiants
    etudiants.forEach(function(etudiant) {

        // On récupère les informations de l'étudiant
        const nom = etudiant.nom;
        const prenom = etudiant.prenom;
        const email = etudiant.email;
        const classe = etudiant.classe;
        const note = etudiant.note;

        // On convertit la note en nombre
        const noteNumérique = Number(note);

        // On détermine le résultat de l'étudiant
        let resultat;
        if (noteNumérique >= 10) {
            resultat = "Admis";
        } else {
            resultat = "Echec";
        }

        // On choisit la couleur du résultat
        let couleur;
        if (resultat === "Admis") {
            couleur = "green";
        } else {
            couleur = "red";
        }

        // On crée une ligne HTML
        const ligne = document.createElement("tr");

        // On associe la ligne à l'objet étudiant
        ligne.etudiant = etudiant;

        // On insère les informations dans la ligne
        ligne.innerHTML = `
            <td>
                <span class="nomModifier">${nom}</span>
                <span class="prenomModifier">${prenom}</span>
            </td>
            <td class="emailModifier">${email}</td>
            <td class="classeModifier">${classe}</td>
            <td class="noteModifier">${note}</td>
            <td>
                <span class="badge" style="color: ${couleur}">
                    ${resultat}
                </span>
            </td>
            <td>
                <button class="btn-modifier">Modifier</button>
                <button class="btn-supprimer">Supprimer</button>
            </td>
        `;

        // On ajoute la ligne au tableau HTML
        listeEtudiants.appendChild(ligne);

        
        // Bouton pour modifier l'étudiant sauvegardé
        const boutonModifier = ligne.querySelector(".btn-modifier");

        boutonModifier.addEventListener("click", function() {
            nomInput.value = etudiant.nom;
            prenomInput.value = etudiant.prenom;
            emailInput.value = etudiant.email;
            classeInput.value = etudiant.classe;
            noteInput.value = etudiant.note;

            tableauModifier = ligne;
            boutonAjouter.textContent = "Modifier";
        });

        // Bouton pour supprimer l'étudiant sauvegardé
        const boutonSupprimer = ligne.querySelector(".btn-supprimer");

        boutonSupprimer.addEventListener("click", function() {
            if (confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
                const index = etudiants.indexOf(etudiant);

                if (index !== -1) {
                    etudiants.splice(index, 1);
                }

                ligne.remove();

                localStorage.setItem("etudiants", JSON.stringify(etudiants));

                mettreAJourStatistiques();
            }
        });

     });

}

afficherEtudiantsSauvegardes();
mettreAJourStatistiques();


// 2. AJOUT ET MODIFICATION D'UN ÉTUDIANT
form.addEventListener("submit", function(event)
{
    event.preventDefault();
 //  je recupere les valeurs saisies dans les champs

 const nom = nomInput.value ;
 const prenom = prenomInput.value ;
 const email = emailInput.value ;
 const classe = classeInput.value ;
 const note = noteInput.value ;

// Vérification des champs obligatoires.
    if (
        nom === "" ||
        prenom === "" ||
        email === "" ||
        classe === "" ||
        note === ""
    ) {
        messageSucces.textContent = " ❌ Veuillez remplir tous les champs.";
        messageSucces.style.color = "red";
        return;
    }
 // Vérification du format de l'adresse email
const formatEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatEmail.test(email)) {
        messageSucces.textContent =
            "❌ Veuillez saisir une adresse email valide.";
        messageSucces.style.color = "red";
        return;
    }

// On convertit la note saisie dans le formulaire en nombre.
// Même si le champ affiche un nombre, sa valeur est une chaîne de caractères.
const noteNumérique = Number(note);
 // Vérification de la note.
    if (
        !Number.isFinite(noteNumérique) ||
        noteNumérique < 0 ||
        noteNumérique > 20
    ) {
        messageSucces.textContent =
            "La note doit être comprise entre 0 et 20.";
        messageSucces.style.color = "red";
        return;
    }

//On crée une variable destinée à reçevoir le resultat
let resultat ;
// On vérifie si la note est supérieure ou égale à 10.
if(noteNumérique >= 10)
{
  resultat = "Admis";
}
else
{
  resultat = "Echec";
}
// On choisit la couleur selon le resultat
let couleur;
if(resultat === "Admis" )
{                      
  couleur= "green";
}                      
else                   
{                      
  couleur= "red"; 
}                      
 // CAS 1 : MODIFICATION D'UN ÉTUDIANT EXISTANT
 // Si le tableau est en cours de mofification
 if(tableauModifier !== null)
 {
    // On recupere les enciennes informations du tableau
    const nomModifier = tableauModifier.querySelector(".nomModifier");
    const prenomModifier = tableauModifier.querySelector(".prenomModifier");
    const emailModifier = tableauModifier.querySelector(".emailModifier");
    const classeModifier = tableauModifier.querySelector(".classeModifier");
    const noteModifier = tableauModifier.querySelector(".noteModifier");
    const etudiant = tableauModifier.etudiant;
    // On les remplace par les nouvelles
    nomModifier.textContent = nom;
    prenomModifier.textContent = prenom;
    emailModifier.textContent = email;
    classeModifier.textContent = classe;
    noteModifier.textContent = note;

    // On met à jour le résultat de l'étudiant.
const resultatModifier = tableauModifier.querySelector(".badge");

resultatModifier.textContent = resultat;
resultatModifier.style.color = couleur;

    etudiant.nom = nom;
    etudiant.prenom = prenom;
    etudiant.email = email;
    etudiant.classe = classe;
    etudiant.note = note;
// Sauvegarder les modifications
localStorage.setItem("etudiants", JSON.stringify(etudiants));
   
   // La modification est terminéé 
    // On remet la variable à null
    tableauModifier = null ;
    mettreAJourStatistiques();
    // On arrete ici pour ne pas creer un nouveau tableau
    return; 
    
 }
 // CAS 2 : AJOUT D'UN NOUVEL ÉTUDIANT
 // Nous créons un objet contenant toutes les informations de l'etudiant
 // Notre objectif est que les étudiants soient ajoutés à partir des informations 
 // saisies dans le formulaire
 const etudiant = 
 {
  // Les propriétés (nom,prenom,email,classe,note) reçoivent les valeurs de leurs variables  respectives
    nom : nom ,
    prenom : prenom ,
    email :  email ,
    classe : classe ,
    note : note 
 };
 // Nous utiliserons la methode "push" pour  ajouter l'objet etudiant au tableau 
// etudiants : le tableau qui contiendra les etudiants        
// push: la methode qui permet d'ajouter un étudiant au tableau
// etudiant : l'objet contenant les informations d'un etudiant 
etudiants.push(etudiant);                                     
// Sauvgarde des etudiants
localStorage.setItem("etudiants",JSON.stringify(etudiants));
// Pour afficher un étudiant, nous allons créer une ligne HTML <tr>
// qui contiendra ses informations dans des cellules <td>,
// puis insérer cette ligne dans le <tbody> du tableau HTML.
const ligne = document.createElement("tr");
ligne.etudiant = etudiant;
// ${resultat} permet d'afficher le résultat calculé (Admis ou Échec)
// ${couleur}  La couleur choisie selon le résultat
ligne.innerHTML =
 `
   <td>
     <span class="nomModifier">${nom}</span>
     <span class="prenomModifier">${prenom}</span>
   </td>
    <td class="emailModifier">${email}</td>
    <td class="classeModifier">${classe}</td>
    <td class="noteModifier">${note}</td>
    <td><span class="badge" style="color: ${couleur}">${resultat}</span></td>
    <td>
        <button class="btn-modifier">Modifier</button>
        <button class="btn-supprimer">Supprimer</button>
    </td>
`;
 // Nous ajoutons la ligne dans le corps du tableau HTML
listeEtudiants.appendChild(ligne);
mettreAJourStatistiques();
// Afficher le message après l'ajout de l'étudiant
messageSucces.textContent = "L'étudiant a été ajouté avec succès !";
// On vide le formulaire après l'ajout
form.reset();

// Bouton Modifier
// On recupère le bouton modifier
const boutonModifier = ligne.querySelector(".btn-modifier");
// Lorsque l'utilisateur clique sur ce bouton
boutonModifier.addEventListener("click",function()
{
     
    // On récupère les anciennes informations de l'étudiant
    const nomModifier = ligne.querySelector(".nomModifier");
    const prenomModifier = ligne.querySelector(".prenomModifier");
    const emailModifier = ligne.querySelector(".emailModifier");
    const classeModifier = ligne.querySelector(".classeModifier");
    const noteModifier = ligne.querySelector(".noteModifier");

    // On remet les anciennes informations dans les champs du formulaire
    nomInput.value=nomModifier.textContent;
    prenomInput.value = prenomModifier.textContent;
    emailInput.value = emailModifier.textContent;
    classeInput.value = classeModifier.textContent;
    noteInput.value = noteModifier.textContent;

   // On memorise la ligne de l'etudiant à modifier
   tableauModifier = ligne;



});

// Suppression
 // On recupère le bouton supprimer
const boutonSupprimer = ligne.querySelector(".btn-supprimer");
// Lorsque l'utilisateur cliquera dessus
boutonSupprimer.addEventListener("click", function()
{
  // On dmande une confirmation avant la suppression
  // la fonction javascript "confirm" permet d'afficher une petite fenetre de confirmation
  const confirmation = confirm("Voulez-vous vraiment supprimer cet étudiant ?");
  // Si l'utilisateur confirme
  if(confirmation === true)
  {
    // On recherche la position de l'étudiant dans le tableau JavaScript
        const index = etudiants.indexOf(ligne.etudiant);

        // Si l'étudiant a été trouvé
        if (index !== -1)
        {
            // On supprime l'étudiant du tableau JavaScript
            etudiants.splice(index, 1);

        }
        // On supprime la ligne de l'étudiant du tableau HTML
          ligne.remove();
          // Sauvegarder les modifications
          localStorage.setItem("etudiants", JSON.stringify(etudiants));

     // On recalcule les statistiques après la suppression
 mettreAJourStatistiques();                                         
          
  }
  
});
});
// On declenche la recherche à chaque saisi ou suppression de caractère
recherche.addEventListener("input",function()
{
  // On recupere le texte saisi dans la recherche
  // toLowerCase() est une methode javascript qui permet de transformer un texte en miniscule
  // afin de faciliter la comparaison sans tenir comptes des majuscules
  const texteRecherche = recherche.value.toLowerCase();
  // On recupere toutes les lignes du tableau
  const lignes = listeEtudiants.querySelectorAll("tr");
  // On parcourt chaque ligne du tableau
  lignes.forEach(function(ligne)
{

  // On recupere le texte contenu dans la ligne
  const texteLigne = ligne.textContent.toLowerCase();
  // On verifie si la ligne contient le texte recherché
  if(texteLigne.includes(texteRecherche)) //  include: Vérifie si le texte recherché est présent
  {
    ligne.style.display= ""; // Réaffiche une ligne correspondante
  }
  else
  {                         
    ligne.style.display= "none"; // Masque une ligne qui ne correspond pas
  }                         

});

})














                                                                                                                                                                                                                    
                                                                                                                                                                            

