document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('searchButton');
  const searchForm = document.getElementById('searchForm');
  const latitudeInput = document.getElementById('latitude');
  const longitudeInput = document.getElementById('longitude');

  if (searchButton) {
    searchButton.addEventListener('click', async function() {
      try {
        const location = await getCurrentLocation();
        latitudeInput.value = location.latitude;
        longitudeInput.value = location.longitude;
        searchForm.submit(); // Submit the form to the server
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }

  // Function to retrieve current location using Geolocation API
  function getCurrentLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          resolve({ latitude, longitude });
        },
        error => {
          reject(error);
        }
      );
    });
  }

  document.querySelectorAll('.favourite-button').forEach(button => {
    button.addEventListener('click', async function() {
      const name = this.dataset.name;
      const address = this.dataset.vicinity;
      const status = this.dataset.status;

      try {
        const response = await fetch('/favourites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, address, status })
        });
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });
});

function confirmDelete(){
  return confirm("Do you want to delete this item?")
}
