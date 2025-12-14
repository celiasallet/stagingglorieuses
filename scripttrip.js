const API_URL = 'https://script.google.com/macros/s/AKfycbxe9qhXXolzVPKWSXeKIf4V5cLxiZK3MR7GH9osZ6toem6iyLu6q5tDqLz9ug0GuQ5W/exec';

const form = document.getElementById('trip-form');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      driver: document.getElementById('driver').value,
      departure: document.getElementById('departure').value,
      seats_total: document.getElementById('trip-seats').value
    })
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