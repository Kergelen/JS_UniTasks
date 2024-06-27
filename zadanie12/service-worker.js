const CACHE_NAME = 'notes-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/style.css',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache)
          .catch(err => {
            console.error('Failed to cache resources during install:', err);
          });
      })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method === 'GET' && event.request.url.endsWith('/api/notes')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (!response || response.status !== 200) {
            throw new Error('Failed to fetch notes');
          }
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, clonedResponse);
            });
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(response => {
              if (response) {
                return response;
              }
              return new Response(JSON.stringify([]), {
                headers: { 'Content-Type': 'application/json' }
              });
            });
        })
    );
  } else if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
  }
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
