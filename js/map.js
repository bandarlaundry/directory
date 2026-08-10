import { getBasePath } from './business.js';

let map = null;
let markersGroup = null;

export function initMap(elementId, center = [-6.4025, 106.9680], zoom = 11) {
  const mapElement = document.getElementById(elementId);
  if (!mapElement) return null;

  // Hapus map lama jika re-init
  if (map !== null) {
    map.remove();
    map = null;
  }

  // Inisialisasi Leaflet Map
  map = L.map(elementId, {
    scrollWheelZoom: true
  }).setView(center, zoom);

  // Pasang Tile Layer OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  markersGroup = L.layerGroup().addTo(map);

  // Paksa render ulang dua kali untuk menangani pencetakan layar lambat
  setTimeout(() => { if (map) map.invalidateSize(); }, 100);
  setTimeout(() => { if (map) map.invalidateSize(); }, 600);

  return map;
}

export function updateMapMarkers(businesses) {
  if (!map || !markersGroup) return;

  markersGroup.clearLayers();
  const basePath = getBasePath();
  const validBounds = [];

  businesses.forEach(b => {
    const lat = parseFloat(b.latitude);
    const lng = parseFloat(b.longitude);

    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      validBounds.push([lat, lng]);

      const marker = L.marker([lat, lng]);
      const detailUrl = `${basePath}/${b.categorySlug || 'laundry'}/${b.citySlug || 'lokasi'}/${b.slug}`;

      const popupHtml = `
        <div style="font-size:13px; line-height:1.4; padding:2px;">
          <strong style="color:#0284c7; font-size:14px;">${b.name}</strong><br>
          <span style="color:#64748b;">${b.category}</span><br>
          <small>📍 ${b.city || ''}</small><br>
          <a href="${detailUrl}" style="display:block; margin-top:8px; background:#0284c7; color:#fff; text-decoration:none; padding:6px 10px; border-radius:6px; font-size:12px; text-align:center; font-weight:600;">Lihat Detail & Map</a>
        </div>
      `;

      marker.bindPopup(popupHtml);
      markersGroup.addLayer(marker);
    }
  });

  // Zoom & Pusatkan ke seluruh titik pin yang ada
  if (validBounds.length > 0) {
    const bounds = L.latLngBounds(validBounds);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }

  setTimeout(() => { if (map) map.invalidateSize(); }, 300);
}

export function setMapCenter(lat, lng, zoom = 15) {
  if (map) {
    map.setView([lat, lng], zoom);
    map.invalidateSize();
  }
}
