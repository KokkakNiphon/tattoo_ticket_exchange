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
    document.querySelectorAll('area').forEach(area => {
      area.addEventListener('click', function(e) {
        e.preventDefault();
        const zone = this.dataset.zone;
        checkSeatStatus(zone);
      });
    });
  });
  