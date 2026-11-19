// Criando o mapa Leaflet 
const map = L.map('map').setView([-14.2, -51.9], 4); // (latitude, longitude, zoom)

// Adicionando o mapa base do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors' //apenas adiciona a referencia a api
}).addTo(map);

// Disponibiliza o mapa para os outros arquivos JavaScript
window.map = map;