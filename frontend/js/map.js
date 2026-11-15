// Criando o mapa Leaflet
const map = L.map('map', {
    preferCanvas: true
}).setView([-14.2, -51.9], 4);

// Disponibiliza o mapa para os outros arquivos JavaScript
window.map = map;


// Adicionando o mapa base do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);