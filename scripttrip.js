const API_URL = 'https://script.google.com/macros/s/AKfycbxzOTh0DY9594hPsmxGtAqDWYPgl7gTqVD9jrxSzuxZjthGQ5sWHzbwe2HorJR923ZD/exec';

const tripForm = document.getElementById('trip-form');

tripForm.addEventListener('submit', function (e) {
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


/////////////

