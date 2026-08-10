import { db } from './firebase-config.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Utility Dapatkan Base Path (misal /directory)
export function getBasePath() {
  const path = window.location.pathname;
  if (path.startsWith('/directory')) {
    return '/directory';
  }
  return '';
}

// Generator Slug SEO
export function createSlug(text) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Haversine Distance (km)
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  return (R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)))).toFixed(1);
}

// Fetch Usaha Aktif
export async function fetchActiveBusinesses() {
  const q = query(collection(db, "businesses"), where("status", "==", "active"));
  const snap = await getDocs(q);
  const results = [];
  snap.forEach(docSnap => results.push({ id: docSnap.id, ...docSnap.data() }));
  return results;
}

// Fetch Usaha by Slug
export async function fetchBusinessBySlug(slug) {
  const q = query(collection(db, "businesses"), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}
