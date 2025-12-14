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
      ${trip.seats_left === 0 ? 
          '<span class="full">Complet</span>' :
          `<input type="text" placeholder="Prénom" class="passenger-name"/>
           <button>Réserver</button>`
      }
    `;

    if (trip.seats_left > 0) {
      const button = card.querySelector('button');
      const input = card.querySelector('.passenger-name');

      button.addEventListener('click', () => {
        const name = input.value.trim();
        if (!name) return alert("Veuillez saisir un prénom");

        // Mise à jour côté front immédiatement
        trip.passengers.push(name);
        trip.seats_left--;
        card.querySelector('.seats-left').textContent = trip.seats_left;
        card.querySelector('.passengers-list').textContent = trip.passengers.join(', ');

        if (trip.seats_left === 0) {
          button.remove();
          input.remove();
          const full = document.createElement('span');
          full.className = 'full';
          full.textContent = 'Complet';
          card.appendChild(full);
        }

        // Envoyer la réservation au serveur
        fetch(API_URL, {  // <-- juste API_URL, pas /reserve
          method: 'POST',
          body: JSON.stringify({ tripId: trip.id, passenger: name }),
          headers: { 'Content-Type': 'application/json' }
        }).catch(err => console.error('Erreur réservation', err));

        input.value = ''; // vide l’input
      });
    }

    container.appendChild(card);
  });
}

// Fonction pour récupérer les trajets
function refreshTrips() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => renderTrips(data))
    .catch(err => console.error('Erreur récupération trajets', err));
}

// Récupération initiale
refreshTrips();

// Rafraîchissement toutes les 10 secondes
setInterval(refreshTrips, 10000);
