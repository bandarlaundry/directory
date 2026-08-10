import { getBasePath } from './business.js';

let map = null;
let markersGroup = null;

export function initMap(elementId, center = [-6.4025, 106.9680], zoom = 12) {
  map = L.map(elementId).setView(center, zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  markersGroup = L.layerGroup().addTo(map);
  return map;
}

export function updateMapMarkers(businesses) {
  if (!markersGroup) return;
  markersGroup.clearLayers();

  const basePath = getBasePath();

  businesses.forEach(b => {
    if (b.latitude && b.longitude) {
      const marker = L.marker([b.latitude, b.longitude]);
      const detailUrl = `${basePath}/${b.categorySlug || 'laundry'}/${b.citySlug || 'lokasi'}/${b.slug}`;

      marker.bindPopup(`
        <div style="font-size:13px; line-height:1.4;">
          <strong style="color:#0284c7;">${b.name}</strong><br>
          <span style="color:#64748b;">${b.category}</span><br>
          <small>${b.city}</small><br>
          <a href="${detailUrl}" style="display:inline-block; margin-top:6px; background:#0284c7; color:#fff; text-decoration:none; padding:4px 8px; border-radius:4px; font-size:11px; text-align:center; width:100%;">Lihat Detail SEO</a>
        </div>
      `);
      markersGroup.addLayer(marker);
    }
  });
}

export function setMapCenter(lat, lng, zoom = 15) {
  if (map) map.setView([lat, lng], zoom);
}
