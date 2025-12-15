const API_URL = 'https://script.google.com/macros/s/AKfycbxY2_7kuMrdNJ7xNKzA1sdDWhfBm_xBBwzEYASmditw-IkzgV5p5E3wPbeAZJDRYh7L/exec';

const form = document.getElementById('trip-form');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const tripData = {
        driver: document.getElementById('driver').value,
        departure: document.getElementById('departure').value,
        seats_total: document.getElementById('trip-seats').value
    };

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(tripData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Trajet ajouté 🚗');
            form.reset();
        } else {
            alert('Erreur : ' + data.error);
        }
    })
    .catch(err => {
        alert('Erreur réseau');
        console.error(err);
    });
});
