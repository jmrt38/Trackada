// import modules
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import readline from "readline";

// variables
const cheminJson = join(homedir(), "Dev", "ada-tech", "bloc1", "projets", "trackada", "track.json");
const existeJson = existsSync(cheminJson);
const cheminProjets = join(homedir(), "Dev", "ada-tech", "bloc1", "projets");
const existeProjets = existsSync(cheminProjets);
let resultatParsing;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Vérification de l'existence du fichier track.json et parsing du contenu si le fichier existe
function checkTrackJson() {
    if (existeJson) {
        try {
            const contenuJson = readFileSync(cheminJson, "utf-8");
            resultatParsing = JSON.parse(contenuJson);
            return resultatParsing;
        } catch (erreur) {
            console.error("Erreur lors du parsing du fichier JSON :", erreur);
            return null;
        }
    } else {
        console.log("Le fichier n'existe pas à cet emplacement :", cheminJson);
        return null;
    }
}

// Verification dossier parent des projets
function checkDossierParent() {
    return existeProjets ? true : false;
}

// Vérification du dossier .git pour chaque projet
function verifGit(projet) {
    const cheminProjet = join(cheminProjets, projet.name);
    const cheminGit = join(cheminProjet, ".git");
    const gitOk = existsSync(cheminGit);
    return gitOk;
}

// Vérification des fichiers requis pour chaque projet
function verifFichiers(projet) {
    const fichiersManquants = [];
    const cheminProjet = join(cheminProjets, projet.name);

    projet.required.forEach((fichier) => {
        const cheminFichier = join(cheminProjet, fichier);
        const fichierOk = existsSync(cheminFichier);

        if (!fichierOk) {
            fichiersManquants.push(fichier);
        }
    });
    return fichiersManquants;
}

// Filtrage des projets corrects
let projetsOk = [];
function filtrerProjetsOk() {
    projetsOk = resultatParsing.projects.filter((projet) => {
        const cheminProjet = join(cheminProjets, projet.name);
        const existeProjet = existsSync(cheminProjet);
        const fichiersManquants = verifFichiers(projet);
        const gitok = verifGit(projet);

        return existeProjet && gitok && fichiersManquants.length === 0;
    });
}

// Message pour les fichiers manquants
const msgFichiersManquants = (projet) => {
    const fichiersManquants = verifFichiers(projet);
    if (fichiersManquants.length > 0 && fichiersManquants.length < 3) {
        return `- il manque ${fichiersManquants.slice(0, 2).join(" et ")}`;
    }
    if (fichiersManquants.length >= 3) {
        return `- il manque ${fichiersManquants.slice(0, -1).join(", ")} et ${fichiersManquants.slice(-1).join(" et ")}`;
    }
    return "";
};

// Vérification de chaque projet
function verifProjet() {
    resultatParsing.projects.forEach((projet) => {
        const cheminProjet = join(cheminProjets, projet.name);
        const existeProjet = existsSync(cheminProjet);
        const nomProjet = projet.name;

        if (projetsOk.includes(projet)) {
            console.log(`✅ Dossier du projet ${nomProjet} est complet`);
        } else if (!existeProjet) {
            console.log(`❌ Dossier du projet ${nomProjet}`);
            console.log(`- le dossier n'existe pas ou n'est pas nommé correctement`);
        } else {
            const fichiersManquants = verifFichiers(projet);
            const gitok = verifGit(projet);

            console.log(`❌ Dossier du projet ${nomProjet}`);

            if (!gitok) {
                console.log(`- le repository git n'est pas initialisé`);
            }
            if (fichiersManquants.length > 0) {
                console.log(msgFichiersManquants(projet));
            }
        }
    });
}

// Pourcentage de projets corrects
function pourcentageProjetsOk() {
    const totalProjets = resultatParsing.projects.length;
    const nbProjetsOk = projetsOk.length;
    const pourcentage = Math.round((nbProjetsOk / totalProjets) * 100);

    return pourcentage;
}

// Affichage du pourcentage de projets corrects
function afficherPourcentage() {
    const totalProjets = resultatParsing.projects.length;
    const nbProjetsOk = projetsOk.length;
    const pourcentage = pourcentageProjetsOk();

    if (nbProjetsOk === totalProjets) {
        console.log(`✅ ${pourcentage}% des projets sont initialisés correctement ${nbProjetsOk}/${totalProjets}`);
    } else {
        console.log(`❌ ${pourcentage}% des projets sont initialisés correctement ${nbProjetsOk}/${totalProjets}`);
    }
}

// Fonction principale orchestrant les vérifications
function main() {
    // 1. Vérifier le dossier parent
    const dossierParentOk = checkDossierParent();
    if (!dossierParentOk) {
        console.log(`❌ Arrêt du programme : Le dossier parent des projets n'existe pas à cet emplacement : ${cheminProjets}`);
        rl.close();
        return;
    }

    // 2. Charger le JSON
    const donneesJson = checkTrackJson();
    if (!donneesJson) {
        console.log("❌ Arrêt du programme : Impossible de charger ou de parser le fichier track.json.");
        rl.close();
        return;
    }

    // 3. Filtrer les projets corrects
    filtrerProjetsOk();

    // 4. Afficher les résultats
    verifProjet();

    // 5. Afficher le pourcentage
    afficherPourcentage();

    // Fermeture propre de l'interface readline à la fin du programme
    rl.close();
}

// Utilisation de readline pour lancer l'exécution à la demande
rl.question("Appuyez sur Entrée pour lancer la vérification des projets...", () => {
    main();
});