// public/javascripts/scripts.js
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
});

// Example function to retrieve current location using Geolocation API
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
