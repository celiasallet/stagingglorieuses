const API_URL = 'https://script.google.com/macros/s/AKfycbxY2_7kuMrdNJ7xNKzA1sdDWhfBm_xBBwzEYASmditw-IkzgV5p5E3wPbeAZJDRYh7L/exe';
// ======= FONCTION D'AFFICHAGE DES TRAJETS =======
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

    if (trip.seats_left > 0) {
      card.querySelector('button').addEventListener('click', () => {
        alert(`Tu as réservé une place pour ${trip.driver} !`);
        // Ici tu peux ajouter un fetch POST pour gérer la réservation côté Apps Script
      });
    }

    container.appendChild(card);
  });
}

// ======= FETCH DES TRAJETS =======
function loadTrips() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => renderTrips(data))
    .catch(err => console.error('Erreur récupération trajets', err));
}

// Chargement initial des trajets
loadTrips();

// ======= GESTION DU FORMULAIRE =======
const form = document.getElementById('trip-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const driver = document.getElementById('driver').value;
  const departure = document.getElementById('departure').value;
  const seats_total = Number(document.getElementById('trip-seats').value);

  const tripData = { driver, departure, seats_total };

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tripData)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Trajet ajouté avec succès !');
        form.reset();
        loadTrips(); // rafraîchir la liste des trajets
      } else {
        alert('Erreur : ' + data.error);
      }
    })
    .catch(err => console.error('Erreur lors de l\'ajout du trajet', err));
});
