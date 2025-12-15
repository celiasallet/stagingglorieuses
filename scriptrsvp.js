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
      <p>🪑 <span class="seats-left">${trip.seats_left}</span> / ${trip.seats_total} places disponibles</p>
    `;
	
	// Après le contenu de base
	if(trip.reservedPseudos && trip.reservedPseudos.length > 0){
	const reservedList = document.createElement('p');
	reservedList.className = 'reserved-list';
	reservedList.textContent = 'Réservé par : ' + trip.reservedPseudos.join(', ');
	card.appendChild(reservedList);
	}
//////
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

	fetch(API_URL, {
		method: 'POST',
		body: JSON.stringify({
		action: 'reserve',
		trip_id: trip.id,
		pseudo: pseudo
		})
	})
	.then(res => res.json())
	.then(data => {
		console.log('Réponse API:', data);
		if(data.success){
		alert(`${pseudo} a réservé une place`);
		// Optionnel : décrémente directement le front
		const seatsLeftSpan = card.querySelector('.seats-left');
		seatsLeftSpan.textContent = Number(seatsLeftSpan.textContent) - 1;
		if(Number(seatsLeftSpan.textContent) === 0){
			// On peut cacher l'input + bouton et afficher "Complet"
			input.remove();
			button.remove();
			const full = document.createElement('span');
			full.className = 'full';
			full.textContent = 'Complet';
			card.appendChild(full);
		}
		} else {
		alert('Erreur : ' + data.error);
		}
	})
	.catch(err => {
		console.error(err);
		alert('Erreur lors de la réservation');
	});
	});
    }

    container.appendChild(card);
  });
}

console.log('RSVP script chargé');

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    // Filtre uniquement les trajets valides
    const tripsData = (Array.isArray(data) ? data : data.result)
      .filter(trip => !isNaN(Number(trip.seats_total)) && !isNaN(Number(trip.seats_left)));

    // On sépare trajets et réservations
    const trips = tripsData.filter(t => t.seats_total > 1); // trajets principaux
    const reservations = tripsData.filter(t => t.seats_total === 1 && t.pseudo); // réservations

    // Pour chaque trajet, on récupère les pseudos
    trips.forEach(trip => {
      trip.reservedPseudos = reservations
        .filter(r => r.driver === trip.driver && r.departure === trip.departure)
        .map(r => r.pseudo);
    });

    renderTrips(trips);
  })
  .catch(err => console.error('Erreur récupération trajets', err));


// fetch(API_URL)
//   .then(res => res.json())
//   .then(data => {
//     console.log('DATA:', data);
//     const trips = Array.isArray(data) ? data : data.result;
//     renderTrips(trips);
//   })
//   .catch(err => console.error('Erreur récupération trajets', err));


