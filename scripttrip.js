const API_URL = 'COLLE_ICI_TON_URL_WEB_APP';

function renderTrips(trips) {
  const container = document.getElementById('trips-container');
  container.innerHTML = ''; // reset container

  trips.forEach(trip => {
    const card = document.createElement('div');
    card.className = 'trip-card';

  
    // action sur le bouton réserver
    if (trip.seats_left > 0) {
      const button = card.querySelector('button');
      button.addEventListener('click', () => {
        const name = prompt("Entrez votre prénom pour réserver :");
        if (!name) return;

        trip.passengers.push(name);         // ajoute le passager
        trip.seats_left--;                  // décrémente les places

        // met à jour le DOM
        card.querySelector('.seats-left').textContent = trip.seats_left;
        card.querySelector('.passengers-list').textContent = trip.passengers.join(', ');

        // si plus de places, désactive le bouton
        if (trip.seats_left === 0) {
          button.remove();
          const full = document.createElement('span');
          full.className = 'full';
          full.textContent = 'Complet';
          card.appendChild(full);
        }
      });
    }

    container.appendChild(card);
  });
}

// Fetch des trajets depuis Apps Script
fetch(API_URL)
  .then(res => res.json())
  .then(data => renderTrips(data))
  .catch(err => console.error('Erreur récupération trajets', err));
