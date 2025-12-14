const API_URL = 'https://script.google.com/macros/s/AKfycbwLdg-X1eTLb-vedwChQCIogovrPFq5lywCOY21mUBbVdSzAsG44jOdr5c4WwVZncVU/exec';

function renderTrips(trips) {
  const container = document.getElementById('trips-container');
  container.innerHTML = ''; // reset container

  trips.forEach(trip => {
    const card = document.createElement('div');
    card.className = 'trip-card';

    // on crée une liste pour les passagers
    if (!trip.passengers) trip.passengers = [];

    card.innerHTML = `
      <h3>🚗 ${trip.driver}</h3>
      <p>📍 Départ : ${trip.departure}</p>
      <p>🪑 <span class="seats-left">${trip.seats_left}</span> / ${trip.seats_total} places disponibles</p>
      <p>👥 Passagers : <span class="passengers-list">${trip.passengers.join(', ')}</span></p>
      ${trip.seats_left === 0 ? '<span class="full">Complet</span>' : '<button>Réserver</button>'}
    `;

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
