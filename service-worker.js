const CACHE_NAME = 'onuvuti-cache-v1';

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return fetch(event.request)
        .then(function(response) {
          if (event.request.method === 'GET' && response && response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(function() {
          return cache.match(event.request);
        });
    })
  );
});
