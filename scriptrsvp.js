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
  <p>🪑 <span class="seats-left">${trip.seats_left}</span> / ${trip.seats_total} places disponibles</p>

  ${
    trip.seats_left === 0
      ? '<span class="full">Complet</span>'
      : `
        <input 
          type="text" 
          placeholder="Ton pseudo" 
          class="pseudo-input"
        />
        <button>Réserver</button>
      `
  }
`;
    // Exemple : action sur le bouton réserver
if (trip.seats_left > 0) {
  const button = card.querySelector('button');
  const input = card.querySelector('.pseudo-input');

  button.addEventListener('click', () => {
    const pseudo = input.value.trim();

    if (!pseudo) {
      alert('Merci d’entrer un pseudo');
      return;
    }

    console.log('Réservation par :', pseudo);
    alert(`${pseudo}, ta réservation est prise en compte (simulation)`);
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
