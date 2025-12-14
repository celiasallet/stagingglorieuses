const API_URL = 'https://script.google.com/macros/s/AKfycbwLdg-X1eTLb-vedwChQCIogovrPFq5lywCOY21mUBbVdSzAsG44jOdr5c4WwVZncVU/exec';

function renderTrips(trips) {
  const container = document.getElementById('trips-container');
  container.innerHTML = ''; // reset container

  trips.forEach(trip => {
    const card = document.createElement('div');
    card.className = 'trip-card';

    card.innerHTML = `
      <h3>🚗 ${trip.driver}</h3>
      <p>📍 Départ : ${trip.departure}</p>
      <p>🪑 ${trip.seats_left} / ${trip.seats_total} places disponibles</p>
      ${trip.seats_left === 0 ? '<span class="full">Complet</span>' : '<button>Réserver</button>'}
    `;

    // Exemple : action sur le bouton réserver
    if (trip.seats_left > 0) {
      card.querySelector('button').addEventListener('click', () => {
        alert(`Tu as réservé une place pour ${trip.driver} !`);
        // Ici tu peux ajouter un fetch POST pour gérer la réservation côté Apps Script
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