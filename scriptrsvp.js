const API_URL = 'https://script.google.com/macros/s/AKfycbxY2_7kuMrdNJ7xNKzA1sdDWhfBm_xBBwzEYASmditw-IkzgV5p5E3wPbeAZJDRYh7L/exec';

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
  .then(data => {
    console.log('Data reçue:', data);

    // Si data.result existe, c'est ton tableau réel
    const trips = Array.isArray(data) ? data : data.result;
    if (!Array.isArray(trips)) {
      console.error('Les données ne sont pas un tableau', trips);
      return;
    }

    renderTrips(trips);
  })
  .catch(err => console.error('Erreur récupération trajets', err));
