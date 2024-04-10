const canvas = document.querySelector("canvas");
const context = canvas.getContext('2d');

const boxSize = 100; // Ajustement pour l'exemple, ajustez selon la taille de votre canvas

key_game_check = false;
end = false;
map_count = 1;
right = true;
left = false;
start = false;
moov_trap = 0;
moov_timer = 0;
trap_switch = true;
map_check = false;
timer = false;
validtimer = false;

let startTime;
let timerInterval;

let timer_niveau1 = 0;
let timer_niveau2 = 0;
let timer_niveau3 = 0;
let timer_niveau4 = 0;
let timer_niveau5 = 0;
let timer_niveau6 = 0;
let timer_niveau7 = 0;
let timer_niveau8 = 0;


function PremiereConnexion() {
    return localStorage.getItem('FirstSignUp') === 'true';
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 10); // Mise à jour toutes les secondes
    if (PremiereConnexion()) {
        console.log('premiere connexion');
        envoyerTempsNiveau(1, 99999999.99, 0)
        envoyerTempsNiveau(2, 99999999.99, 0)
        envoyerTempsNiveau(3, 99999999.99, 0)
        envoyerTempsNiveau(4, 99999999.99, 0)
        envoyerTempsNiveau(5, 99999999.99, 0)
        envoyerTempsNiveau(6, 99999999.99, 0)
        envoyerTempsNiveau(7, 99999999.99, 0)
        envoyerTempsNiveau(8, 99999999.99, 0)
        localStorage.setItem('FirstSignUp', 'false');
    }
}

function updateTimer() {
    const elapsedTime = Date.now() - startTime;
    document.getElementById('timer').innerText = formatTime(elapsedTime);
}

function formatTime(timeInMillis) {
    let milliseconds = timeInMillis % 1000;
    let seconds = Math.floor(timeInMillis / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    // Formatte le temps au format MM:SS:SSS
    return `${pad(minutes)}:${pad(seconds)}:${padMilliseconds(milliseconds)}`;
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}

function formatTime(timeInMillis) {
    let milliseconds = Math.floor((timeInMillis % 1000) / 10); // Arrondir aux deux chiffres les plus significatifs
    let seconds = Math.floor(timeInMillis / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    // Formatte le temps au format MM:SS:MS
    return `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}


function stopTimer() {
    clearInterval(timerInterval); // Arrête le timer

    const elapsedTime = Date.now() - startTime; // Calcule le temps écoulé depuis le début du timer
    const totalSeconds = elapsedTime / 1000; // Convertit le temps écoulé en secondes
    const formattedTime = totalSeconds.toFixed(2);

    // Utilise des 'if' pour enregistrer le temps écoulé dans la variable correspondante en fonction de `map_count`
    if (map_count === 1) {
        timer_niveau1 = formattedTime;
        recupererDernierTemps(1, timer_niveau1);
    } else if (map_count === 2) {
        timer_niveau2 = formattedTime;
        recupererDernierTemps(2, timer_niveau2);
    } else if (map_count === 3) {
        timer_niveau3 = formattedTime;
        recupererDernierTemps(3, timer_niveau3);
    } else if (map_count === 4) {
        timer_niveau4 = formattedTime;
        recupererDernierTemps(4, timer_niveau4);
    } else if (map_count === 5) {
        timer_niveau5 = formattedTime;
        recupererDernierTemps(5, timer_niveau5);
    } else if (map_count === 6) {
        timer_niveau6 = formattedTime;
        recupererDernierTemps(6, timer_niveau6);
    } else if (map_count === 7) {
        timer_niveau7 = formattedTime;
        recupererDernierTemps(7, timer_niveau7);
    } else if (map_count === 8) {
        timer_niveau8 = formattedTime;
        recupererDernierTemps(8, timer_niveau8);
    }
}

function envoyerTempsNiveau(niveauId, temps, total) {
    console.log(`Envoi au serveur - Niveau ID: ${niveauId}, MeilleurTemps: ${temps}, TempsTotal: ${total}`); // Ajoute cette ligne
    fetch('/api/enregistrer-temps', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            niveauId,
            temps,
            total,
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Échec de l’enregistrement du temps');
            }
            return response.json();
        })
        .then(data => console.log('Succès:', data))
        .catch(error => console.error('Erreur:', error));
}

function recupererDernierTemps(niveauId, temps) {
    fetch(`/api/dernier-temps?niveauId=${niveauId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('La requête a échoué');
            }
            return response.json();
        })
        .then(data => {
            console.log('Dernier temps récupéré:', data);
            // Convertit les temps en nombres flottants avant de les additionner
            const tempsActuel = parseFloat(temps);
            const tempsTotalPrecedent = data.TempsTotal !== null ? parseFloat(data.TempsTotal) : 0;
            const total = tempsTotalPrecedent + tempsActuel;

            // Détermine le meilleur temps
            const meilleurTempsPrecedent = data.MeilleurTemps !== null ? parseFloat(data.MeilleurTemps) : null;
            const meilleurTemps = meilleurTempsPrecedent !== null && meilleurTempsPrecedent <= tempsActuel ? meilleurTempsPrecedent : tempsActuel;

            envoyerTempsNiveau(niveauId, meilleurTemps, total);
        })
        .catch(error => {
            console.error('Erreur:', error);
            // En cas d'erreur, considère cela comme la première tentative et envoie simplement le temps actuel
            const tempsActuel = parseFloat(temps);
            envoyerTempsNiveau(niveauId, tempsActuel, tempsActuel);
        });
}







const moveLimits = {
    map1: 23,//23
    map2: 24,//24
    map3: 32,//32
    map4: 23,//23
    map5: 23,//23
    map6: 43,//43
    map7: 35,//32
    map8: 33,//33
    // Ajoutez d'autres niveaux au besoin
};

let sol = []; //0
let PJ = []; // 3
let obstacles = []; // 2
let obstacles_immobiles = []; // 1
let key_game = [] // 4
let door = [] // 5
let finish = [] // 6
let mob = [] // 7
let trap = [] // 8


const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const map1 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 3, 1, 1],
    [1, 1, 1, 0, 0, 7, 0, 0, 1, 1],
    [1, 1, 1, 0, 7, 0, 7, 1, 1, 1],
    [1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 2, 0, 0, 2, 0, 1, 1],
    [1, 1, 0, 2, 0, 2, 0, 6, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const map2 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
    [1, 1, 7, 1, 8, 8, 0, 0, 1, 1],
    [1, 0, 8, 1, 1, 10, 10, 2, 1, 1],
    [1, 0, 0, 1, 1, 0, 8, 0, 1, 1],
    [1, 3, 0, 1, 1, 6, 7, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 7, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const map3 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 6, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 5, 1, 1],
    [1, 1, 1, 0, 8, 8, 0, 0, 3, 1],
    [1, 1, 1, 8, 1, 8, 1, 0, 0, 1],
    [1, 1, 1, 0, 0, 7, 8, 8, 0, 1],
    [1, 4, 1, 8, 1, 8, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 7, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const map4 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 1, 4, 0, 2, 1, 1, 1, 1],
    [1, 0, 2, 8, 10, 0, 5, 0, 1, 1],
    [1, 2, 0, 2, 0, 2, 2, 6, 0, 1],
    [1, 0, 2, 0, 2, 0, 2, 2, 0, 1],
    [1, 1, 0, 2, 0, 2, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const map5 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 6, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 5, 2, 0, 1, 1],
    [1, 1, 3, 1, 8, 0, 2, 0, 1, 1],
    [1, 1, 0, 1, 0, 8, 0, 8, 1, 1],
    [1, 1, 7, 1, 2, 2, 2, 2, 1, 1],
    [1, 1, 8, 0, 8, 0, 0, 8, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 4, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const map6 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 3, 0, 1, 1, 1, 1, 1],
    [1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 4, 1, 1, 1, 1, 1],
    [1, 1, 8, 10, 0, 0, 1, 1, 1, 1],
    [1, 1, 7, 1, 2, 2, 0, 0, 1, 1],
    [1, 1, 0, 0, 2, 0, 7, 1, 1, 1],
    [1, 1, 1, 1, 1, 5, 2, 0, 1, 1],
    [1, 1, 1, 1, 1, 6, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const map7 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 6, 0, 1, 1],
    [1, 1, 1, 1, 1, 0, 5, 0, 1, 1],
    [1, 1, 0, 4, 1, 2, 2, 2, 1, 1],
    [1, 1, 7, 2, 0, 7, 2, 0, 1, 1],
    [1, 1, 0, 1, 7, 0, 0, 3, 1, 1],
    [1, 1, 9, 1, 1, 8, 1, 1, 1, 1],
    [1, 1, 8, 9, 8, 9, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const map8 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 6, 0, 1, 1, 1, 1],
    [1, 1, 1, 2, 5, 2, 1, 1, 1, 1],
    [1, 2, 1, 2, 0, 0, 1, 0, 1, 1],
    [2, 0, 0, 2, 2, 2, 0, 0, 4, 1],
    [0, 2, 2, 2, 0, 0, 2, 2, 0, 1],
    [1, 3, 0, 2, 0, 0, 2, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const maptest = [
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 7, 1, 1, 1, 1, 1, 1, 1],
    [3, 0, 8, 2, 6, 1, 1, 1, 1, 1],
    [0, 0, 9, 4, 5, 0, 0, 1, 1, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];


canvas.width = map.length * boxSize;
canvas.height = map.length * boxSize;

const image_personnage_1 = new Image();
const image_personnage_2 = new Image();
const image_personnage_1_gauche = new Image();
const image_personnage_2_gauche = new Image();
const image_sol = new Image();
const image_obstacle = new Image();
const image_personnage_coup = new Image();
const image_personnage_coup_gauche = new Image();
const image_key = new Image();
const image_door = new Image();
const image_finish = new Image();
const image_mob = new Image();
const image_mob_dead = new Image();
const image_trap = new Image();
const image_notrap = new Image();

image_personnage_1.src = "IMG/ASSET/PJ1.png";
image_personnage_2.src = "IMG/ASSET/PJ2.png";
image_personnage_coup.src = "IMG/ASSET/PJ_coup.png";
image_personnage_1_gauche.src = "IMG/ASSET/PJ1_gauche.png";
image_personnage_2_gauche.src = "IMG/ASSET/PJ2_gauche.png";
image_personnage_coup_gauche.src = "IMG/ASSET/PJ_coup_gauche.png";
image_sol.src = "IMG/ASSET/sol.png";
image_obstacle.src = "IMG/ASSET/bloc.png";
image_key.src = "IMG/ASSET/key.png"
image_door.src = "IMG/ASSET/door.png"
image_finish.src = "IMG/ASSET/finish.png"
image_mob.src = "IMG/ASSET/mob.png"
image_mob_dead.src = "IMG/ASSET/mob_dead.png"
image_trap.src = "IMG/ASSET/piege.png";
image_notrap.src = "IMG/ASSET/nopiege.png";



//Animation personnage (statique / push)
let currentCharacterImage = image_personnage_1;
let pushing = false;
let pushing_check = false;
if (pushing === false) {
    setInterval(() => {
        currentCharacterImage = (currentCharacterImage === image_personnage_1) ? image_personnage_2 : image_personnage_1;
        draw();
    }, 500);
} else if (pushing === true) {
    setInterval(() => {
        currentCharacterImage = image_personnage_coup;
        draw();
    }, 250); // 
}

let currentCharacterImage_gauche = image_personnage_1_gauche;
if (pushing === false) {
    setInterval(() => {
        currentCharacterImage_gauche = (currentCharacterImage_gauche === image_personnage_1_gauche) ? image_personnage_2_gauche : image_personnage_1_gauche;
        draw();
    }, 500);
} else if (pushing === true) {
    setInterval(() => {
        currentCharacterImage_gauche = image_personnage_coup_gauche;
        draw();
    }, 250); // 
}





function generateObstacles(map) {
    // Vider les tableaux avant de générer de nouveaux obstacles pour éviter des doublons
    PJ = [];
    obstacles = [];
    obstacles_immobiles = [];
    key_game = [];
    door = [];
    finish = [];
    mob = [];
    trap = [];

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === 2) { // Obstacle mobile
                obstacles.push({ x: col * boxSize, y: row * boxSize });
                sol.push({ x: col * boxSize, y: row * boxSize });
            } else if (map[row][col] === 3) { // Personnage
                PJ.push({ x: col * boxSize, y: row * boxSize });
                sol.push({ x: col * boxSize, y: row * boxSize });
            } else if (map[row][col] === 0) { // Obstacle immobile
                sol.push({ x: col * boxSize, y: row * boxSize });
            } else if (map[row][col] === 1) { // Obstacle immobile
                obstacles_immobiles.push({ x: col * boxSize, y: row * boxSize });
            } else if (map[row][col] === 4) { // Clé
                key_game.push({ x: col * boxSize, y: row * boxSize });
                sol.push({ x: col * boxSize, y: row * boxSize });
            } else if (map[row][col] === 5) { // Porte
                door.push({ x: col * boxSize, y: row * boxSize });
                sol.push({ x: col * boxSize, y: row * boxSize });
            } else if (map[row][col] === 6) { // Fin
                finish.push({ x: col * boxSize, y: row * boxSize });
                sol.push({ x: col * boxSize, y: row * boxSize });
            } else if (map[row][col] === 7) { // Mob
                mob.push({ x: col * boxSize, y: row * boxSize });
                sol.push({ x: col * boxSize, y: row * boxSize });
            } else if (map[row][col] === 8) { // Trap
                trap.push({ x: col * boxSize, y: row * boxSize });
                sol.push({ x: col * boxSize, y: row * boxSize });
            } else if (map[row][col] === 9) { // Trap
                trap.push({ x: col * boxSize, y: row * boxSize });
                sol.push({ x: col * boxSize, y: row * boxSize });
            } else if (map[row][col] === 10) { // Trap
                obstacles.push({ x: col * boxSize, y: row * boxSize });
                trap.push({ x: col * boxSize, y: row * boxSize });
                sol.push({ x: col * boxSize, y: row * boxSize });
            }
        }
    }
    if (map_count === 5 || map_count === 6 || map_count === 7) {
        map_check = true;
    } else {
        map_check = false;
    }
    initializeMoveCount();

    if (map_check === true) {
        trap_switch = false;
        SwitchTrap()
    } else if (map_check === false) {
        trap_switch = true;
        image_trap.src = "IMG/ASSET/piege.png";
    }

}



document.addEventListener("keydown", moov);
let d;

function moov(event) {
    let key = event.keyCode;
    let validMove = false; // Ajout pour indiquer si le mouvement est valide

    if (key == 90 || key == 38) { // Z
        d = "UP";
        validMove = true;
    } else if (key == 81 || key == 37) { // Q
        d = "LEFT";
        validMove = true;
    } else if (key == 83 || key == 40) { // S
        d = "DOWN";
        validMove = true;
    } else if (key == 68 || key == 39) { // D
        d = "RIGHT";
        validMove = true;
    }

    if (moov_timer === 0 && validMove === true) {
        moov_timer += 1;
        moov_trap += 1;
        validtimer = true;
    }

    if (moov_trap === 0 && validMove === true) {
        moov_trap += 1;
    }

    if (validtimer === true) {
        startTimer()
        validtimer = false;
    }

    if (validMove) {
        movePlayer(d); // Déplacer le joueur seulement si une touche valide est pressée
    }

    if (key == 82) { //permet de réinitialiser la map
        key_game_check = false;
        if (map_count === 1) {
            setTimeout(() => {
                generateObstacles(map1);
            }, 10);
        } else if (map_count === 2) {
            setTimeout(() => {
                generateObstacles(map2);
            }, 10);
        } else if (map_count === 3) {
            setTimeout(() => {
                generateObstacles(map3);
            }, 10);
        } else if (map_count === 4) {
            setTimeout(() => {
                generateObstacles(map4);
            }, 10);
        } else if (map_count === 5) {
            setTimeout(() => {
                generateObstacles(map5);
            }, 10);
        } else if (map_count === 6) {
            setTimeout(() => {
                generateObstacles(map6);
            }, 10);
        } else if (map_count === 7) {
            setTimeout(() => {
                generateObstacles(map7);
            }, 10);
        } else if (map_count === 8) {
            setTimeout(() => {
                generateObstacles(map8);
            }, 10);
        }

        if (map_check === true) {
            trap_switch = false;
        }


        moov_trap = 0;
    }

    updateMoveCountDisplay();
    moveCount();
}

function movePlayer() {
    let dx = 0;
    let dy = 0;


    switch (d) {
        case "UP":
            dy = -boxSize;
            break;
        case "LEFT":
            dx = -boxSize;
            break;
        case "DOWN":
            dy = boxSize;
            break;
        case "RIGHT":
            dx = boxSize;
            break;
    }

    start = true;


    if (map_check === true) {
        trap_switch = false;
        SwitchTrap();
    }



    let newX = PJ[0].x + dx;
    let newY = PJ[0].y + dy;

    let obstacleIndex = getObstacleIndex(newX, newY);
    let obstacleIndexImmobile = getObstacleImmobileIndex(newX, newY);
    let doorIndex = getDoorIndex(newX, newY);
    let keyIndex = getKeyIndex(newX, newY);
    let mobIndex = getMobIndex(newX, newY);
    let finishIndex = getFinishIndex(newX, newY);
    let trapIndex = getTrapIndex(newX, newY);


    if (finishIndex !== -1 && move_count !== 0) { //vérifie si la fin est réglementaire
        PJ[0].x = newX; // Met à jour la position du joueur pour être sur la fin
        PJ[0].y = newY;
        // Le joueur a atteint la case d'arrivée
        finish.splice(finishIndex, 1);
        // Ici, vous pouvez ajouter toute logique nécessaire pour gérer la victoire,
        // comme arrêter le jeu, afficher un écran de victoire, etc.
        // Par exemple, pour arrêter de déplacer le joueur après la victoire :
        end = true;
        if (end === true && map_count === 8) {
            stopTimer()
            setTimeout(() => {
                winScreen();
            }, 150);
            setTimeout(() => {
                window.location.href = './jeu.html';
            }, 1500);


        } else if (end === true) {
            stopTimer()
            map_count += 1;
            setTimeout(() => {
                setTimeout(() => {
                    winScreen();
                }, 150);
                setTimeout(() => {
                    nowinScreen();
                }, 1500);
                if (map_count === 2) {
                    generateObstacles(map2);
                } else if (map_count === 3) {
                    generateObstacles(map3);
                } else if (map_count === 4) {
                    generateObstacles(map4);
                } else if (map_count === 5) {
                    generateObstacles(map5);
                } else if (map_count === 6) {
                    generateObstacles(map6);
                } else if (map_count === 7) {
                    generateObstacles(map7);
                } else if (map_count === 8) {
                    generateObstacles(map8);
                }
                validtimer = false;
                move_count = 0;
                moov_trap = 0;
                moov_timer = 0;
                initializeMoveCount();
                // Ajoutez ici toute autre logique de victoire, comme recharger le jeu ou passer au niveau suivant
            }, 250);
        }

    }




    // Collecter la clé si disponible
    if (keyIndex !== -1 && !isObstacleOnKey(key_game[keyIndex]) && !isMobOnKey(key_game[keyIndex])) {
        key_game.splice(keyIndex, 1); // Supprimez la clé de l'array pour qu'elle ne soit plus dessinée
        key_game_check = true; // Le joueur a maintenant la clé
    }

    if (trapIndex !== -1 && !isObstacleOnTrap(trap[trapIndex]) && trap_switch === true) {
        move_count -= 1;
        // Alternez l'état du piège ici, en supposant que vous ayez une fonction ou une logique pour le faire
    }



    // Ouvrir la porte si le joueur a la clé
    if (doorIndex !== -1 && key_game_check === true) {
        move_count -= 1;
        moov_trap += 1;
        moov_timer += 1;
        door.splice(doorIndex, 1); // Supprime la porte de l'array
        PJ[0].x = newX; // Met à jour la position du joueur pour être sur la porte
        PJ[0].y = newY;
        key_game_check = false;
    } else if (mobIndex !== -1) {
        // Si un mob est présent, tentez de le pousser
        trapIndex = getTrapIndex(PJ[0].x, PJ[0].y);
        ontrap = trapIndex !== -1;

        if (ontrap === true && trap_switch === true) {
            move_count -= 1
        }

        if (pushMob(mobIndex, dx, dy)) {

            move_count -= 1;
            moov_trap += 1;
            moov_timer += 1;
            pushing = true; // Le personnage pousse un mob
            pushing_check = true
            if (pushing === true) {
                setTimeout(() => {
                    pushing = false; // Arrêtez de montrer l'image de poussée
                    draw(); // Redessinez avec l'image normale
                }, 250); // Délai pour afficher l'image de poussée
            }
        }
        // Si le mob ne peut pas être poussé, le joueur reste sur place (ne faites rien)
    } else if (newX >= 0 && newX < canvas.width && newY >= 0 && newY < canvas.height && obstacleIndexImmobile === -1 && doorIndex === -1) {

        if (obstacleIndex === -1) {
            // Si aucun obstacle n'est sur le chemin, déplacez le joueur
            PJ[0].x = newX;
            PJ[0].y = newY;
        } else {
            // Tentative de pousser un obstacle
            if (pushObstacle(obstacleIndex, dx, dy)) {
                pushing = true; // Le personnage pousse un bloc
                pushing_check = true;
                if (pushing === true) {
                    setTimeout(() => {
                        pushing = false; // Arrêtez de montrer l'image de poussée
                        draw(); // Redessinez avec l'image normale
                    }, 250); // Délai pour afficher l'image de poussée
                }
            } else {//fait l'animation de pousser même si c'est pas possible
                pushing = true;
                pushing_check = true;
                if (pushing === true) {
                    setTimeout(() => {
                        pushing = false; // Arrêtez de montrer l'image de poussée
                        draw(); // Redessinez avec l'image normale
                    }, 250); // Délai pour afficher l'image de poussée
                }

            }

        }
        trapIndex = getTrapIndex(PJ[0].x, PJ[0].y);
        ontrap = trapIndex !== -1;
        if (ontrap === true && pushing_check === true && trap_switch === true) {
            move_count -= 2;
            moov_trap += 1;
            moov_timer += 1;
        } else {
            move_count -= 1;
            moov_trap += 1;
            moov_timer += 1;
        }
    }
    trap.forEach((trapItem) => {
        if (isMobOnTrap(trapItem) && trap_switch === true) {
            // Si un mob est sur un piège, trouvez ce mob et retirez-le
            let mobIndex = mob.findIndex(m => m.x === trapItem.x && m.y === trapItem.y);
            if (mobIndex !== -1) {
                mob.splice(mobIndex, 1); // Supprime le mob
            }
        }
    });
    pushing_check = false;
    draw(); // Redessinez l'état actuel du jeu
}

function SwitchTrap() {
    if (moov_trap % 2 === 0 || moov_trap === 0) {
        trap_switch = false;
        image_trap.src = "IMG/ASSET/nopiege.png";
    } else {
        trap_switch = true;
        image_trap.src = "IMG/ASSET/piege.png";
    }

    draw();
}



function getObstacleIndex(x, y) {
    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].x === x && obstacles[i].y === y) {
            return i;
        }
    }
    return -1;
}

function getObstacleImmobileIndex(x, y) {
    for (let i = 0; i < obstacles_immobiles.length; i++) {
        if (obstacles_immobiles[i].x === x && obstacles_immobiles[i].y === y) {
            return i;
        }
    }
    return -1;
}

function getKeyIndex(x, y) {
    for (let i = 0; i < key_game.length; i++) {
        if (key_game[i].x === x && key_game[i].y === y) {
            return i;
        }
    }
    return -1;
}

function getDoorIndex(x, y) {
    for (let i = 0; i < door.length; i++) {
        if (door[i].x === x && door[i].y === y) {
            return i;
        }
    }
    return -1;
}

function getFinishIndex(x, y) {
    for (let i = 0; i < finish.length; i++) {
        if (finish[i].x === x && finish[i].y === y) {
            return i;
        }
    }
    return -1;
}

function getMobIndex(x, y) {
    for (let i = 0; i < mob.length; i++) {
        if (mob[i].x === x && mob[i].y === y) {
            return i;
        }
    }
    return -1;
}

function getTrapIndex(x, y) {
    for (let i = 0; i < trap.length; i++) {
        if (trap[i].x === x && trap[i].y === y) {
            return i;
        }
    }
    return -1;
}

function pushObstacle(index, dx, dy) {
    let newX = obstacles[index].x + dx;
    let newY = obstacles[index].y + dy;

    // Recherche si une porte est à l'emplacement cible
    let doorAtNewLocationIndex = door.findIndex(d => d.x === newX && d.y === newY);
    let finishAtNewLocationIndex = finish.findIndex(d => d.x === newX && d.y === newY);

    // Recherche si un mob est à l'emplacement cible
    let mobAtNewLocationIndex = mob.findIndex(m => m.x === newX && m.y === newY);

    // Vérifie si le nouvel emplacement est valide et libre
    if (newX >= 0 && newX < canvas.width && newY >= 0 && newY < canvas.height) {
        let obstacleAtNewLocationIndex = obstacles.findIndex(o => o.x === newX && o.y === newY);
        let immobileObstacleAtNewLocationIndex = obstacles_immobiles.findIndex(o => o.x === newX && o.y === newY);

        // Empêche le déplacement si un autre obstacle, mob, ou la porte se trouve déjà à l'emplacement cible
        if (obstacleAtNewLocationIndex === -1 && immobileObstacleAtNewLocationIndex === -1 && mobAtNewLocationIndex === -1 && doorAtNewLocationIndex === -1 && finishAtNewLocationIndex === -1) {
            obstacles[index].x = newX;
            obstacles[index].y = newY;
            return true; // L'obstacle a été déplacé avec succès
        }
    }
    return false; // Le déplacement n'a pas eu lieu
}

function pushMob(index, dx, dy) {
    let newX = mob[index].x + dx;
    let newY = mob[index].y + dy;

    // Vérifie si le nouvel emplacement est hors limites, ce qui signifierait pousser le mob hors du jeu
    if (newX < 0 || newX >= canvas.width || newY < 0 || newY >= canvas.height) {
        // Supprime le mob car il est poussé hors des limites
        mob.splice(index, 1);
        return true; // Le mob a été "poussé" hors du jeu
    }

    // Vérifie si le nouvel emplacement est occupé par un obstacle, un obstacle immobile, un autre mob, ou une porte
    let obstacleAtNewLocationIndex = obstacles.findIndex(o => o.x === newX && o.y === newY);
    let immobileObstacleAtNewLocationIndex = obstacles_immobiles.findIndex(o => o.x === newX && o.y === newY);
    let mobAtNewLocationIndex = mob.findIndex((m, idx) => m.x === newX && m.y === newY && idx !== index);
    let doorAtNewLocationIndex = door.findIndex(d => d.x === newX && d.y === newY);

    // Si l'emplacement est libre, déplace le mob
    if (obstacleAtNewLocationIndex === -1 && immobileObstacleAtNewLocationIndex === -1 && mobAtNewLocationIndex === -1 && doorAtNewLocationIndex === -1) {
        mob[index].x = newX;
        mob[index].y = newY;
        return true; // Le mob a été déplacé avec succès
    } else {
        // Si l'emplacement n'est pas libre, supprime le mob car il est poussé contre un obstacle
        mob.splice(index, 1);
        return true; // Le mob a été "poussé" et supprimé
    }
}

function isObstacleOnKey(keyPosition) {
    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].x === keyPosition.x && obstacles[i].y === keyPosition.y) {
            return true; // Un obstacle est sur la clé
        }
    }
    return false; // Aucun obstacle sur la clé
}

function isMobOnKey(keyPosition) {
    for (let i = 0; i < mob.length; i++) {
        if (mob[i].x === keyPosition.x && mob[i].y === keyPosition.y) {
            return true; // Un obstacle est sur la clé
        }
    }
    return false; // Aucun obstacle sur la clé
}

function isObstacleOnTrap(trapPosition) {
    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].x === trapPosition.x && obstacles[i].y === trapPosition.y) {
            return true; // Un obstacle est sur la clé
        }
    }
    return false; // Aucun obstacle sur la clé
}

function isMobOnTrap(trapPosition) {
    for (let i = 0; i < mob.length; i++) {
        if (mob[i].x === trapPosition.x && mob[i].y === trapPosition.y) {
            return true; // Un mob est sur le piège
        }
    }
    return false; // Aucun mob sur le piège
}

function removeMobsOnTraps() {
    // Itérer à travers le tableau des pièges
    trap.forEach((trap, index) => {
        // Utiliser la fonction isMobOnTrap pour vérifier si un mob est sur le piège
        if (isMobOnTrap(trap)) {
            // Si un mob est sur un piège, il est supprimé
            // La fonction isMobOnTrap devrait retourner l'index du mob sur le piège, si présent
            let mobIndex = mob.findIndex(m => m.x === trap.x && m.y === trap.y);
            if (mobIndex !== -1) {
                // Supprimer le mob de l'array des mobs
                mob.splice(mobIndex, 1);
            }
        }
    });
}

function moveCount() {
    if (map_count === 1) {
        if (move_count <= -1) {
            setTimeout(() => {
                deadScreen();
            }, 150);
            setTimeout(() => {
                nodeadScreen();
            }, 1500);
            move_count = 23;
            initializeMoveCount()
            setTimeout(() => {
                generateObstacles(map1);
            }, 250);
        }
    } else if (map_count === 2) {
        if (move_count <= -1) {
            setTimeout(() => {
                deadScreen();
            }, 150);
            setTimeout(() => {
                nodeadScreen();
            }, 1500);
            move_count = 24;
            initializeMoveCount()
            setTimeout(() => {
                generateObstacles(map2);
            }, 250);
        }
    } else if (map_count === 3) {
        if (move_count <= -1) {
            setTimeout(() => {
                deadScreen();
            }, 150);
            setTimeout(() => {
                nodeadScreen();
            }, 1500);
            move_count = 32;
            initializeMoveCount()
            setTimeout(() => {
                generateObstacles(map3);
            }, 250);
        }
    } else if (map_count === 4) {
        if (move_count <= -1) {
            setTimeout(() => {
                deadScreen();
            }, 150);
            setTimeout(() => {
                nodeadScreen();
            }, 1500);
            move_count = 23;
            initializeMoveCount()
            setTimeout(() => {
                generateObstacles(map4);
            }, 250);
        }
    } else if (map_count === 5) {
        if (move_count <= -1) {
            setTimeout(() => {
                deadScreen();
            }, 150);
            setTimeout(() => {
                nodeadScreen();
            }, 1500);
            move_count = 23;
            initializeMoveCount()
            setTimeout(() => {
                generateObstacles(map5);
            }, 250);
        }
    } else if (map_count === 6) {
        if (move_count <= -1) {
            setTimeout(() => {
                deadScreen();
            }, 150);
            setTimeout(() => {
                nodeadScreen();
            }, 1500);
            move_count = 43;
            initializeMoveCount()
            setTimeout(() => {
                generateObstacles(map6);
            }, 250);
        }
    } else if (map_count === 7) {
        if (move_count <= -1) {
            setTimeout(() => {
                deadScreen();
            }, 150);
            setTimeout(() => {
                nodeadScreen();
            }, 1500);
            move_count = 32;
            initializeMoveCount()
            setTimeout(() => {
                generateObstacles(map7);
            }, 250);
        }
    } else if (map_count === 8) {
        if (move_count <= -1) {
            setTimeout(() => {
                deadScreen();
            }, 150);
            setTimeout(() => {
                nodeadScreen();
            }, 1500);
            move_count = 33;
            initializeMoveCount()
            setTimeout(() => {
                generateObstacles(map8);
            }, 250);
        }
    }
}

function initializeMoveCount() {
    // Exemple d'initialisation pour map1
    move_count = moveLimits[`map${map_count}`]; // Obtenez la limite de mouvements pour le niveau actuel
    updateMoveCountDisplay(); // Mettez à jour l'affichage
}

function updateMoveCountDisplay() {
    document.getElementById('moveCount').innerText = `${move_count}`;
}

function winScreen() {
    const win = document.querySelector('.win_hide');
    win.classList.add('win');
    win.classList.remove('win_hide');
}

function nowinScreen() {
    const win = document.querySelector('.win');
    win.classList.add('win_hide');
    win.classList.remove('win');
}

function deadScreen() {
    const dead = document.querySelector('.death_hide');
    dead.classList.add('death');
    dead.classList.remove('death_hide');
}

function nodeadScreen() {
    const dead = document.querySelector('.death');
    dead.classList.add('death_hide');
    dead.classList.remove('death');
}



function draw() {

    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < sol.length; i++) {
        context.drawImage(image_sol, sol[i].x, sol[i].y, boxSize, boxSize);
    }
    
    for (let i = 0; i < trap.length; i++) {
        context.drawImage(image_trap, trap[i].x, trap[i].y, boxSize, boxSize);
    }

    for (let i = 0; i < key_game.length; i++) {
        context.drawImage(image_key, key_game[i].x, key_game[i].y, boxSize, boxSize);
    }

    for (let i = 0; i < obstacles.length; i++) {
        context.drawImage(image_obstacle, obstacles[i].x, obstacles[i].y, boxSize, boxSize);
    }

    for (let i = 0; i < obstacles_immobiles.length; i++) {
        context.fillStyle = "black";
        context.fillRect(obstacles_immobiles[i].x, obstacles_immobiles[i].y, boxSize, boxSize);
    }


    for (let i = 0; i < door.length; i++) {
        context.drawImage(image_door, door[i].x, door[i].y, boxSize, boxSize);
    }

    for (let i = 0; i < finish.length; i++) {
        context.drawImage(image_finish, finish[i].x, finish[i].y, boxSize, boxSize);
    }

    for (let i = 0; i < mob.length; i++) {
        context.drawImage(image_mob, mob[i].x, mob[i].y, boxSize, boxSize);
    }


    if (start === false) {
        context.drawImage(currentCharacterImage, PJ[0].x, PJ[0].y, boxSize, boxSize);
    }
    if (PJ.length > 0 && pushing === false && start === true) {
        if (d === "RIGHT") {
            context.drawImage(currentCharacterImage, PJ[0].x, PJ[0].y, boxSize, boxSize);
            right = true;
            left = false;
        }
        else if (d === "LEFT") {
            context.drawImage(currentCharacterImage_gauche, PJ[0].x, PJ[0].y, boxSize, boxSize);
            right = false;
            left = true;
        } else if (d === "UP" && right === true) {
            context.drawImage(currentCharacterImage, PJ[0].x, PJ[0].y, boxSize, boxSize);
            right = true;
            left = false;
        } else if (d === "UP" && left === true) {
            context.drawImage(currentCharacterImage_gauche, PJ[0].x, PJ[0].y, boxSize, boxSize);
            right = false;
            left = true;
        } else if (d === "DOWN" && right === true) {
            context.drawImage(currentCharacterImage, PJ[0].x, PJ[0].y, boxSize, boxSize);
            right = true;
            left = false;
        } else if (d === "DOWN" && left === true) {
            context.drawImage(currentCharacterImage_gauche, PJ[0].x, PJ[0].y, boxSize, boxSize);
            right = false;
            left = true;
        }

    }
    if (d === "RIGHT") {
        const imageToDraw = pushing ? image_personnage_coup : currentCharacterImage;
        context.drawImage(imageToDraw, PJ[0].x, PJ[0].y, boxSize, boxSize);
    } else if (d === "LEFT") {
        const imageToDraw = pushing ? image_personnage_coup_gauche : currentCharacterImage_gauche;
        context.drawImage(imageToDraw, PJ[0].x, PJ[0].y, boxSize, boxSize);
    } else if (d === "UP" && right === true) {
        const imageToDraw = pushing ? image_personnage_coup : currentCharacterImage;
        context.drawImage(imageToDraw, PJ[0].x, PJ[0].y, boxSize, boxSize);
    } else if (d === "UP" && left === true) {
        const imageToDraw = pushing ? image_personnage_coup_gauche : currentCharacterImage_gauche;
        context.drawImage(imageToDraw, PJ[0].x, PJ[0].y, boxSize, boxSize);
    } else if (d === "DOWN" && right === true) {
        const imageToDraw = pushing ? image_personnage_coup : currentCharacterImage;
        context.drawImage(imageToDraw, PJ[0].x, PJ[0].y, boxSize, boxSize);
    } else if (d === "DOWN" && left === true) {
        const imageToDraw = pushing ? image_personnage_coup_gauche : currentCharacterImage_gauche;
        context.drawImage(imageToDraw, PJ[0].x, PJ[0].y, boxSize, boxSize);
    }



}

Promise.all([
    new Promise(resolve => { image_personnage_1.onload = resolve; }),
    new Promise(resolve => { image_personnage_2.onload = resolve; }),
    new Promise(resolve => { image_personnage_1_gauche.onload = resolve; }),
    new Promise(resolve => { image_personnage_2_gauche.onload = resolve; }),
    new Promise(resolve => { image_obstacle.onload = resolve; }),
    new Promise(resolve => { image_personnage_coup.onload = resolve; }),
    new Promise(resolve => { image_key.onload = resolve; }),
    new Promise(resolve => { image_door.onload = resolve; }),
    new Promise(resolve => { image_finish.onload = resolve; }),
    new Promise(resolve => { image_mob.onload = resolve; }),
    new Promise(resolve => { image_mob_dead.onload = resolve; }),
    new Promise(resolve => { image_trap.onload = resolve; }),
    new Promise(resolve => { image_notrap.onload = resolve; })
]).then(() => {
    draw(); // Initialiser le dessin une fois que toutes les images sont chargées
});


// Assurez-vous que toutes les images sont chargées avant de dessiner

function startGame(arg) {
    var music = document.getElementById("music")
    music.play()
    const jeu = document.querySelector('.zone_jeu');
    const niveau = document.querySelector('.nom-niveau');
    const touche = document.querySelector('.touches');
    const timer_move = document.querySelector('.move-timer');
    const niveaux = document.querySelector('.niveaux');
    const noscroll = document.querySelector('html');
    noscroll.style.overflow = 'hidden';

    niveaux.style.display = 'none';
    jeu.style.display = 'flex';
    niveau.style.display = 'flex';
    touche.style.display = 'flex';
    timer_move.style.display = 'flex';



    if (arg === 'niveau1') {
        map_count = 1;
        generateObstacles(map1);
        initializeMoveCount();
    } else if (arg === 'niveau2') {
        map_count = 2;
        generateObstacles(map2);
        initializeMoveCount();
    } else if (arg === 'niveau3') {
        map_count = 3;
        generateObstacles(map3);
        initializeMoveCount();
    } else if (arg === 'niveau4') {
        map_count = 4;
        generateObstacles(map4);
        initializeMoveCount();
    } else if (arg === 'niveau5') {
        map_count = 5;
        generateObstacles(map5);
        initializeMoveCount();
    } else if (arg === 'niveau6') {
        map_count = 6;
        generateObstacles(map6);
        initializeMoveCount();
    } else if (arg === 'niveau7') {
        map_count = 7;
        generateObstacles(map7);
        initializeMoveCount();
    } else if (arg === 'niveau8') {
        map_count = 8;
        generateObstacles(map8);
        initializeMoveCount();
    }

    draw(); // Redessine le canvas avec le jeu en cours

}
