const API_URL = 'https://script.google.com/macros/s/AKfycbxY2_7kuMrdNJ7xNKzA1sdDWhfBm_xBBwzEYASmditw-IkzgV5p5E3wPbeAZJDRYh7L/exec';


function renderTrips(trips) {
  const container = document.getElementById('trips-container');
  container.innerHTML = '';

  trips.forEach(trip => {
    const card = document.createElement('div');
    card.className = 'trip-card';

    // Contenu de base
    card.innerHTML = `
      <h3>🚗 ${trip.driver}</h3>
      <p>📍 Départ : ${trip.departure}</p>
      <p>
        🪑 <span class="seats-left">${trip.seats_left}</span>
        / ${trip.seats_total} places disponibles
      </p>
    `;

    if (trip.seats_left === 0) {
      const full = document.createElement('span');
      full.className = 'full';
      full.textContent = 'Complet';
      card.appendChild(full);
    } else {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Ton pseudo';
      input.className = 'pseudo-input';

      const button = document.createElement('button');
      button.textContent = 'Réserver';

      card.appendChild(input);
      card.appendChild(button);

      button.addEventListener('click', () => {
        const pseudo = input.value.trim();

        if (!pseudo) {
          alert('Merci d’entrer un pseudo');
          return;
        }

        alert(`${pseudo} a réservé une place avec ${trip.driver} (simulation)`);
      });
    }

    container.appendChild(card);
  });
}

fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const trips = Array.isArray(data) ? data : data.result;
      renderTrips(trips);
    })
    .catch(err => console.error('Erreur récupération trajets', err));