// Minimal service worker - no caching
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // Clear all caches
  caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
  });
  self.clients.claim();
});

// No fetch handling - let all requests go directly to network