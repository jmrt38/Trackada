// import modules
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import readline from "readline"

// variables
const cheminJson = join(homedir(), "Dev", "ada-tech", "bloc1", "projets", "trackada", "track.json");
const existeJson = existsSync(cheminJson);
let resultatParsing;
const rl = readline.createInterface({
  input:  process.stdin,
  output: process.stdout
})

// Vérification de l'existence du fichier track.json et parsing du contenu si le fichier existe
if (existeJson) {
    const contenuJson = readFileSync(cheminJson, "utf-8");
    resultatParsing = JSON.parse(contenuJson);
} else {
    console.log("Le fichier n'existe pas à cet emplacement :", cheminJson);
}

// Verification dossier parent des projets
const cheminProjets = join(homedir(), "Dev", "ada-tech", "bloc1", "projets");
const existeProjets = existsSync(cheminProjets);


console.log(existeProjets ? "✅ dossier projets" : "❌ dossier projets introuvable")


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
        })
        return fichiersManquants
}

// Filtrage des projets corrects
const projetsOk = resultatParsing.projects.filter((projet) => {
    const cheminProjet = join(cheminProjets, projet.name);
    const existeProjet = existsSync(cheminProjet);
    const fichiersManquants = verifFichiers(projet);
    const gitok = verifGit(projet);

    return existeProjet && gitok && fichiersManquants.length === 0;
});

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

// Vérification de chaque projets
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
    })
};

// TODO : charger et parser track.json

// TODO : construire le chemin vers ~/ada-tech/bloc1/projets

// TODO : vérifier que ce dossier existe et afficher le résultat

// TODO : pour chaque projet de la track,
//        vérifier que le dossier existe au bon endroit
//        vérifier que le repository git est initialisé
//        vérifier que les fichiers requis sont présents
//        afficher ✅ ou ❌ avec les erreurs dans l'ordre

// TODO : calculer et afficher le pourcentage de projets corrects