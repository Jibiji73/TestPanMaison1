const CACHE_NAME = 'topo-v12';
const ASSETS = [
  './Topo_Escalade_v12.html',
  './manifest.json',
  './pan.png',
  './holds.json'
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

// Fetch : Network First
// Clé de cache = URL SANS query params (?t=...) pour que pan.png?t=123
// corresponde à l'entrée "pan.png" en cache.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  // Clé de cache sans query string
  const cacheKey = new Request(e.request.url.split('?')[0]);

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(cacheKey, clone));
        }
        return response;
      })
      .catch(() => caches.match(cacheKey))
  );
});
