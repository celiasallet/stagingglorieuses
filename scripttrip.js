const API_URL = 'https://script.google.com/macros/s/AKfycbxY2_7kuMrdNJ7xNKzA1sdDWhfBm_xBBwzEYASmditw-IkzgV5p5E3wPbeAZJDRYh7L/exec';

const tripForm = document.getElementById('trip-form');

tripForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const driverInput = document.getElementById('driver').value.trim();
    const departureInput = document.getElementById('departure').value.trim();
    const seatsInput = parseInt(document.getElementById('trip-seats').value, 10);

    if (!driverInput || !departureInput || isNaN(seatsInput) || seatsInput <= 0) {
        alert("Merci de remplir tous les champs correctement !");
        return;
    }

    const tripData = {
        driver: driverInput,
        departure: departureInput,
        seats_total: seatsInput,
        seats_left: seatsInput
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


///////////////////////////


