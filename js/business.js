import { db } from './firebase-config.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Generator Slug SEO-Friendly
export function createSlug(text) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')           // Ganti spasi dengan -
    .replace(/[^\w\-]+/g, '')       // Hapus karakter non-alphanumeric
    .replace(/\-\-+/g, '-')         // Ganti multipel - menjadi satu -
    .replace(/^-+/, '')             // Trim - dari awal
    .replace(/-+$/, '');            // Trim - dari akhir
}

// Haversine Distance Formula (km)
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  return (R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)))).toFixed(1);
}

// Fetch Active Businesses untuk Halaman Utama
export async function fetchActiveBusinesses() {
  const q = query(collection(db, "businesses"), where("status", "==", "active"));
  const snap = await getDocs(q);
  const results = [];
  snap.forEach(docSnap => results.push({ id: docSnap.id, ...docSnap.data() }));
  return results;
}

// Fetch Single Business berdasarkan Slug
export async function fetchBusinessBySlug(slug) {
  const q = query(collection(db, "businesses"), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}
