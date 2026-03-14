const CACHE_NAME = 'topo-v12';
const ASSETS = [
  'Topo_Escalade_v12.html',
  'manifest.json',
  'pan.png',
  'holds.json'
];

// Installation : mise en cache initiale
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activation : supprimer les anciens caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch : Network First — toujours essayer le réseau d'abord
// Si hors-ligne, utiliser le cache comme fallback
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Mettre à jour le cache avec la réponse fraîche
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Réseau indisponible → fallback cache
        return caches.match(e.request);
      })
  );
});
