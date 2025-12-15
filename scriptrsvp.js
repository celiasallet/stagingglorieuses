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

		// Affiche le pseudo déjà réservé s'il existe
		if (trip.pseudo && trip.pseudo.trim() !== "") {
			const pseudoSpan = document.createElement('p');
			pseudoSpan.textContent = `Réservé par : ${trip.pseudo}`;
			card.appendChild(pseudoSpan);
		}

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
					if (data.success) {
						alert(`${pseudo} a réservé une place !`);

						// --- Mise à jour visuelle ---
						const seatsSpan = card.querySelector('.seats-left');
						let seatsLeft = Number(seatsSpan.textContent);
						seatsLeft = seatsLeft - 1;
						seatsSpan.textContent = seatsLeft;

						// Affiche le pseudo dans la carte
						const pseudoSpan = document.createElement('p');
						pseudoSpan.textContent = `Réservé par : ${pseudo}`;
						card.appendChild(pseudoSpan);

						if (seatsLeft === 0) {
							// Remplace input + bouton par "Complet"
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

// Récupération des trajets depuis l'API
fetch(API_URL)
	.then(res => res.json())
	.then(data => {
		console.log('DATA:', data);
		const trips = Array.isArray(data) ? data : data.result;
		renderTrips(trips);
	})
	.catch(err => console.error('Erreur récupération trajets', err));

// function renderTrips(trips) {
// 	const container = document.getElementById('trips-container');
// 	container.innerHTML = '';

// 	trips.forEach(trip => {
// 		const card = document.createElement('div');
// 		card.className = 'trip-card';

// 		// Contenu de base
// 		card.innerHTML = `
//       <h3>🚗 ${trip.driver}</h3>
//       <p>📍 Départ : ${trip.departure}</p>
//       <p>
//         🪑 <span class="seats-left">${trip.seats_left}</span>
//         / ${trip.seats_total} places disponibles
//       </p>
//     `;

// 		if (trip.seats_left === 0) {
// 			const full = document.createElement('span');
// 			full.className = 'full';
// 			full.textContent = 'Complet';
// 			card.appendChild(full);
// 		} else {
// 			const input = document.createElement('input');
// 			input.type = 'text';
// 			input.placeholder = 'Ton pseudo';
// 			input.className = 'pseudo-input';

// 			const button = document.createElement('button');
// 			button.textContent = 'Réserver';

// 			card.appendChild(input);
// 			card.appendChild(button);

// 			button.addEventListener('click', () => {
// 				const pseudo = input.value.trim();

// 				if (!pseudo) {
// 					alert('Merci d’entrer un pseudo');
// 					return;
// 				}

// 				fetch(API_URL, {
// 					method: 'POST',
// 					body: JSON.stringify({
// 						action: 'reserve',
// 						trip_id: trip.id,
// 						pseudo: pseudo
// 					})
// 				})
// 					.then(res => res.json())
// 					.then(data => {
// 						if (data.success) {
// 							alert(`${pseudo} a réservé une place !`);

// 							// --- Mise à jour visuelle ---
// 							const seatsSpan = card.querySelector('.seats-left');
// 							let seatsLeft = Number(seatsSpan.textContent);
// 							seatsLeft = seatsLeft - 1;
// 							seatsSpan.textContent = seatsLeft;

// 							if (seatsLeft === 0) {
// 								// Remplace input + bouton par "Complet"
// 								input.remove();
// 								button.remove();
// 								const full = document.createElement('span');
// 								full.className = 'full';
// 								full.textContent = 'Complet';
// 								card.appendChild(full);
// 							}

// 						} else {
// 							alert('Erreur : ' + data.error);
// 						}
// 					})
// 					.catch(err => {
// 						console.error(err);
// 						alert('Erreur lors de la réservation');
// 					});
// 			});
// 		}

// 		container.appendChild(card);
// 	});
// }

// console.log('RSVP script chargé');

// fetch(API_URL)
// 	.then(res => res.json())
// 	.then(data => {
// 		console.log('DATA:', data);
// 		const trips = Array.isArray(data) ? data : data.result;
// 		renderTrips(trips);
// 	})
// 	.catch(err => console.error('Erreur récupération trajets', err));

