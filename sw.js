const CACHE_NAME = 'topo-v1';
const ASSETS = [
  'Topo_Escalade_v8.html',
  'manifest.json',
  'pan.png',
  'holds.json'
];

// Installation : on met les fichiers en cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Interception des requêtes : on sert le cache si on est hors-ligne
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});