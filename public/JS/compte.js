document.addEventListener('DOMContentLoaded', () => {
    // Récupérer le nom d'utilisateur
    fetch('/api/get-username')
        .then(response => {
            if (!response.ok) {
                throw new Error('La récupération du username a échoué');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('nomUtilisateur').textContent = data.username || 'Utilisateur inconnu';
        })
        .catch(error => {
            console.error(error);
            document.getElementById('nomUtilisateur').textContent = 'Erreur lors de la récupération';
        });

    // Fonction pour récupérer le meilleur temps et le temps total pour un niveau donné
    function recupererEtAfficherMeilleurTemps(niveauId) {
        return fetch(`/api/dernier-temps?niveauId=${niveauId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`La récupération du meilleur temps pour le niveau ${niveauId} a échoué`);
                }
                return response.json();
            })
            .then(data => {
                document.getElementById(`meilleurTemps${niveauId}`).textContent = data.MeilleurTemps + 's' || 'Pas de meilleur temps';
                // Retourne le temps total pour ce niveau, 0 si non disponible
                return parseFloat(data.TempsTotal) || 0;
            })
            .catch(error => {
                console.error(error);
                document.getElementById(`meilleurTemps${niveauId}`).textContent = 'Pas de meilleur temps';
                return 0; // Retourne 0 en cas d'erreur
            });
    }

    // Récupérer et afficher les meilleurs temps pour tous les niveaux
    const niveaux = [1, 2, 3, 4, 5, 6, 7, 8]; // Supposons que vous avez 8 niveaux
    Promise.all(niveaux.map(niveauId => recupererEtAfficherMeilleurTemps(niveauId)))
        .then(tempsTotals => {
            const tempsTotal = tempsTotals.reduce((acc, temps) => acc + temps, 0);
            document.getElementById('tempsTotal').textContent = tempsTotal.toFixed(2) + 's';
        });
});
