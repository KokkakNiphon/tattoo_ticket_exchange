let seatData = []; // This will hold the data from the Google Spreadsheet

function fetchSpreadsheetData(spreadsheetId, apiKey) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:Z?key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Assuming the first row contains column headers: Zone, Seat, Contact
      const rows = data.values.slice(1); // Skip the header row
      seatData = rows.map(row => ({ โซนที่มี: row[0], ที่นั่ง: row[1], วันที่: row[2], คอนแท็กติดต่อ: row[3], ที่หาแลก: row[4], หมายเหตุ: row[5]}));
      console.log(seatData); // Now seatData is populated with the spreadsheet data
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Call fetchSpreadsheetData with your Spreadsheet ID and API Key
fetchSpreadsheetData('1_sanAKZ1OKOpaaLRXA-ebKO_-pJHL7Ph2Qw_XM3XgUQ', 'AIzaSyDX70rFBT0ZFe1eQYhctx9oGHKoT0MBRKI');

// Function to generate a table based on the zone
function generateTableForZone(zone) {
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.innerHTML = `<tr><th>โซนที่มี</th><th>ที่นั่ง</th><th>วันที่</th><th>คอนแท็กติดต่อ</th><th>ที่หาแลก</th><th>หมายเหตุ</th></tr>`;

  const rowData = seatData.find(row => row.โซนที่มี === zone);
  if (rowData) {
    const row = table.insertRow();
    const zoneCell = row.insertCell();
    const seatCell = row.insertCell();
    const dateCell = row.insertCell();
    const contactCell = row.insertCell();
    const targetCell = row.insertCell();
    const noteCell = row.insertCell();
    zoneCell.textContent = rowData.โซนที่มี;
    seatCell.textContent = rowData.ที่นั่ง;
    dateCell.textContent = rowData.วันที่;
    contactCell.textContent = rowData.คอนแท็กติดต่อ;
    targetCell.textContent = rowData.ที่หาแลก;
    noteCell.textContent = rowData.หมายเหตุ;
    zoneCell.style.border = '1px solid white';
    seatCell.style.border = '1px solid white';
    dateCell.style.border = '1px solid white';
    contactCell.style.border = '1px solid white';
    targetCell.style.border = '1px solid white';
    noteCell.style.border = '1px solid white';
  } else {
    // In case no data is found for the zone
    table.innerHTML += `<tr><td colspan="2">ไม่มีข้อมูลโซน ${zone}</td></tr>`;
  }

  return table;
}

function createCircleOverlay(coords) {
  const [x, y, radius] = coords.split(',').map(Number);
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.left = `${x - radius}px`;
  overlay.style.top = `${y - radius}px`;
  overlay.style.width = `${radius * 2}px`;
  overlay.style.height = `${radius * 2}px`;
  overlay.style.borderRadius = '50%'; // Makes the div circular
  overlay.style.backgroundColor = 'rgba(150, 255, 0, 0.5)'; // Green with transparency
  overlay.style.zIndex = '10'; // Ensure it's on top of the image but below any popups
  overlay.style.pointerEvents = 'none'; // Allows clicking through the div
  return overlay;
}

// function drawLine(fromZoneData, toZoneData) {
//   const fromZone = document.querySelector(`area[data-zone="${fromZoneData}"]`);
//   const toZone = document.querySelector(`area[data-zone="${toZoneData}"]`);

//   if (!fromZone || !toZone) {
//     console.error('Zones not found');
//     return;
//   }

//   const fromCoords = fromZone.getAttribute('coords');
//   const toCoords = toZone.getAttribute('coords');

//   const line = createLineElement(fromCoords, toCoords);

//   document.body.appendChild(line);
// }

// function createLineElement(start, end) {
//   const [start_x, start_y, start_radius] = start.split(',').map(Number);
//   const [end_x, end_y, end_radius] = end.split(',').map(Number);
//   const line = document.createElement('div');
//   line.className = 'line';

//   const length = Math.sqrt((start_x - end_x) ** 2 + (start_y - end_y) ** 2);
//   const angle = Math.atan2(end_y - start_y, end_x - start_x) * 180 / Math.PI;

//   line.style.width = `${length}px`;
//   line.style.transform = `rotate(${angle}deg)`;
//   line.style.position = 'absolute';
//   line.style.left = `${start_x}px`;
//   line.style.top = `${start_y}px`;

//   return line;
// }

// Modify the existing checkSeatStatus function
function checkSeatStatus(zone) {
  console.log("Zone clicked:", zone);
  if (!seatData.length) {
    console.log("Data is not loaded yet.");
    return;
  }
  const seatStatusDiv = document.getElementById('seatStatus');
  seatStatusDiv.innerHTML = ''; // Clear previous data
  seatStatusDiv.appendChild(generateTableForZone(zone));
}

document.addEventListener('DOMContentLoaded', () => {
  const imageContainer = document.querySelector('.image-container');
  document.querySelectorAll('area').forEach(area => {
      area.addEventListener('click', function(e) {
          e.preventDefault();
          const zone = this.dataset.zone;
          checkSeatStatus(zone);

          // Clear any existing overlays before adding a new one
          const existingOverlay = document.getElementById('zone-overlay');
          if (existingOverlay) {
              existingOverlay.remove();
          }

          const existingLine = document.getElementById('line');
          if (existingLine) {
            existingLine.remove();
          }

          // drawLine('A1', this.getAttribute('data-zone'));

          // Create and append the new overlay
          const overlay = createCircleOverlay(this.getAttribute('coords'));
          overlay.id = 'zone-overlay'; // Assign an ID for easy removal later
          imageContainer.appendChild(overlay);
      });
  });
});
  