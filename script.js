// script de formulaire pour pop window
alert('SCRIPT CHARGÉ');
const form = document.getElementById('rsvp-form');
const popup = document.getElementById('thankyou-popup');

if (form && popup) {
    const closeBtn = popup.querySelector('.close-btn');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // clé du problème

        popup.style.display = "flex";

        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = "C'est noté !";
        btn.disabled = true;

        form.submit(); // on envoie quand même Google Forms
    });

    closeBtn.addEventListener('click', () => {
        popup.style.display = "none";
    });

    popup.addEventListener('click', (e) => {
        if (e.target === popup) popup.style.display = "none";
    });
}

////////////////////
// tripForm


const API_URL = 'https://script.google.com/macros/s/AKfycbwZplUjWy7PPpjn-cPRwstji_0L2mPQeotLi5Zl8ZSzAWV9_D5h7Bc7hea9Ea6Bw7q3/exec';

const tripForm = document.getElementById('trip-form');
if (tripForm) {
  tripForm.addEventListener('submit', function(e) {
    console.log('SUBMIT TRIP FORM'); // 👈 AJOUTE ÇA
    e.preventDefault();

    const tripData = {
        driver: document.getElementById('driver').value,
        departure: document.getElementById('departure').value,    
        seats_total: parseInt(document.getElementById('trip-seats').value, 10), 
        seats_left: parseInt(document.getElementById('trip-seats').value, 10) 
    };

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(tripData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Trajet ajouté 🚗');
            tripForm.reset();
        } else {
            alert('Erreur : ' + data.error);
        }
    })
    .catch(err => {
        alert('Erreur réseau');
        console.error(err);
    });
});

}

//////////// rsvp covoit 

function renderTrips(trips) {
  const container = document.getElementById('trips-container');
    if (!container) return;
  container.innerHTML = '';

  trips.forEach(trip => {
    const card = document.createElement('div');
    card.className = 'trip-card';

    // Contenu de base
   card.innerHTML = `
  <h3>🚗 ${trip.driver}</h3>
  <p>📍 Départ : ${trip.departure}</p>
  <p>🪑 <span class="seats-left">${trip.seats_left}</span> / ${trip.seats_total} places disponibles</p>
  ${trip.reservedPseudos && trip.reservedPseudos.length > 0 ? `<p class="reserved-list">Réservé par : ${trip.reservedPseudos.join(', ')}</p>` : ''}
`;
	

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

const tripsContainer = document.getElementById('trips-container');

if (tripsContainer) {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
    // Filtre trajets principaux et réservations. changer jusqua render
    const tripsData = data.filter(row => !isNaN(Number(row.seats_total)) && !isNaN(Number(row.seats_left)));

const mainTrips = tripsData.filter(t => t.seats_total > 1); // trajets principaux
const reservations = tripsData.filter(t => t.seats_total === 1 && t.pseudo);

mainTrips.forEach(trip => {
  trip.reservedPseudos = reservations
    .filter(r => r.parent_id === trip.id)
    .map(r => r.pseudo);
});

renderTrips(mainTrips);
  })
  .catch(err => console.error('Erreur récupération trajets', err));
}