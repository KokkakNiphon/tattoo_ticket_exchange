// Assuming firebaseConfig is defined earlier in your code or in another file
document.querySelectorAll('area').forEach(area => {
  area.addEventListener('click', function(e) {
    e.preventDefault();
    const zone = this.dataset.zone;
    checkSeatStatus(zone);
  });
});

function checkSeatStatus(zone) {
  db.collection('seats').doc(zone).get().then((doc) => {
    const seatStatus = doc.exists ? (doc.data().isTaken ? 'Taken' : 'Available') : 'No data';
    document.getElementById('seatStatus').innerText = `Seat Status for ${zone}: ${seatStatus}`;
  }).catch((error) => {
    console.error("Error getting document:", error);
  });
}

// This function will create a circle overlay for debugging purposes
function createCircleOverlay(coords) {
  const [x, y, radius] = coords.split(',').map(Number);
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.left = `${x - radius}px`;
  overlay.style.top = `${y - radius}px`;
  overlay.style.width = `${radius * 2}px`;
  overlay.style.height = `${radius * 2}px`;
  overlay.style.borderRadius = '50%'; // Makes the div circular
  overlay.style.backgroundColor = 'rgba(0, 255, 0, 0.0)'; // Green with transparency
  overlay.style.zIndex = '10'; // Ensure it's on top of the image but below any popups
  overlay.style.pointerEvents = 'none'; // Allows clicking through the div
  return overlay;
}

document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.querySelector('.image-container');
    const cursorCoordsText = document.createElement('div');
    cursorCoordsText.id = 'cursor-coords';
    cursorCoordsText.style.position = 'absolute';
    cursorCoordsText.style.padding = '5px';
    cursorCoordsText.style.backgroundColor = 'white';
    cursorCoordsText.style.color = 'black';
    cursorCoordsText.style.border = '1px solid black';
    cursorCoordsText.style.pointerEvents = 'none'; // Ensure text doesn't interfere with mouse events
    cursorCoordsText.style.zIndex = '1000';
    document.body.appendChild(cursorCoordsText);
  
    imageContainer.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element
      cursorCoordsText.textContent = `Coords: (${Math.round(x)}, ${Math.round(y)})`;
      cursorCoordsText.style.left = `${e.pageX + 10}px`;
      cursorCoordsText.style.top = `${e.pageY + 10}px`;
    });
  
    document.querySelectorAll('area').forEach(area => {
      const overlay = createCircleOverlay(area.getAttribute('coords'));
      imageContainer.appendChild(overlay);
    });
  });