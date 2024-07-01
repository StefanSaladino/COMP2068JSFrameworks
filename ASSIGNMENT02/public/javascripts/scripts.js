document.addEventListener('DOMContentLoaded', function() {

  const buttons = document.querySelectorAll('button[data-search-term]');
  const searchForm = document.getElementById('searchForm');
  const latitudeInput = document.getElementById('latitude');
  const longitudeInput = document.getElementById('longitude');
  const searchTermInput = document.getElementById('searchTerm');

  buttons.forEach(button => {
    button.addEventListener('click', async function() {
      const searchTerm = this.getAttribute('data-search-term');
      console.log('Button clicked:', searchTerm); // Debug log

      try {
        const location = await getCurrentLocation();
        latitudeInput.value = location.latitude;
        longitudeInput.value = location.longitude;
        searchTermInput.value = searchTerm;
        console.log('Form data:', {
          latitude: latitudeInput.value,
          longitude: longitudeInput.value,
          searchTerm: searchTermInput.value
        }); // Debug log

        searchForm.submit(); // Submit the form to the server
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });

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
