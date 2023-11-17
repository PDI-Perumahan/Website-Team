// Ambil elemen div
const jsonInfoDiv = document.getElementById("jsonInfo");
// Dapatkan nilai filename dari atribut data
const filename = jsonInfoDiv.getAttribute("data-filename");

// Baca file JSON
// Periksa apakah filename adalah string yang valid
if (filename && typeof filename === 'string') {
    // Baca file JSON
    fetch(`../../media/3d-env/${filename}`)
        .then(response => response.json())
        .then(data => displayJSONInfo(data))
        .catch(error => console.error('Error fetching JSON:', error));
} else {
    console.error('Invalid filename:', filename);
}
// Fungsi untuk menampilkan informasi JSON pada halaman web
function displayJSONInfo(data) {
    // Konversi data JSON menjadi format string untuk ditampilkan
    const jsonString = JSON.stringify(data, null, 2);

    // Tampilkan informasi JSON pada halaman web
    // jsonInfoDiv.innerText = jsonString;
    // Tampilkan informasi JSON pada halaman web dengan elemen <pre>
    jsonInfoDiv.innerHTML = `<pre>${jsonString}</pre>`;
}
