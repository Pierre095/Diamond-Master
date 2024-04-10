function estUtilisateurConnecte() {
    // Vérifie si la clé 'isLoggedIn' existe dans le stockage local et si elle est vraie
    return localStorage.getItem('isLoggedIn') === 'true';
}

document.addEventListener('DOMContentLoaded', () => {
    const estConnecte = estUtilisateurConnecte();
    const inscriptionConnexion = document.querySelector('.signin-login');
    const boutonCompte = document.getElementById('compte');

    if (estConnecte) {
        // Cache les boutons d'inscription et de connexion si l'utilisateur est connecté
        inscriptionConnexion.style.display = 'none';
        // Affiche le bouton de compte
        boutonCompte.style.display = 'flex'; // ou 'flex' selon votre mise en page
    } else {
        // Affiche les boutons d'inscription et de connexion si l'utilisateur n'est pas connecté
        inscriptionConnexion.style.display = 'flex';
        // Cache le bouton de compte
        boutonCompte.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    const choixCompte = document.getElementById('choixCompte'); 
    if (choixCompte) { // S'assure que l'élément existe
        choixCompte.addEventListener('click', (e) => {
            e.preventDefault(); // Empêche l'action par défaut de l'élément

            if (estUtilisateurConnecte()) {
                console.log('Utilisateur connecté, redirection vers compte.html');
                window.location.href = 'compte.html';
            } else {
                console.log('Utilisateur non connecté, redirection vers login.html');
                window.location.href = 'login.html';
            }            
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const boutonDeconnexion = document.getElementById('boutonDeconnexion');
    boutonDeconnexion.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        
        // Redirection immédiate vers la page de déconnexion réussie
        window.location.href = './index.html';
    });
});


