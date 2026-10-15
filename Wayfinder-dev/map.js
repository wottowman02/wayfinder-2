import { LeafletMap, TileLayer, Marker } from 'leaflet';

let map;
let tripMarkers = [];

// Create the map and display the OpenStreetMap tiles.
function initializeMap() {
    const mapContainer = document.getElementById('map');

    if (!mapContainer) {
        console.error('Leaflet map container was not found.');
        return;
    }

    map = new LeafletMap('map').setView([20, 0], 2);

    new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

// Remove the old markers and add markers for trips with coordinates.
function renderTripMarkers(trips) {
    if (!map) return;

    tripMarkers.forEach(marker => marker.remove());
    tripMarkers = [];

    trips.forEach(trip => {
        if (trip.latitude == null || trip.longitude == null) {
            return;
        }

        const latitude = Number(trip.latitude);
        const longitude = Number(trip.longitude);

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            return;
        }

        const marker = new Marker([latitude, longitude])
            .addTo(map)
            .bindPopup(`
                <strong>${escapePopupText(trip.title || 'Untitled trip')}</strong>
                <br>
                ${escapePopupText(trip.destination || '')}
            `);

        tripMarkers.push(marker);
    });
}

// Escape trip text before inserting it into a popup.
function escapePopupText(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

// Make the marker function available to the existing app.js.
window.wayfinderMap = {
    renderTripMarkers
};

// The HTML is already parsed when this module executes.
initializeMap();