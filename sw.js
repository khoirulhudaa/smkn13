const CACHE_NAME = 'xpresensi-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/logo.ico',
  '/logo-192x192.png',
  '/logo-512x512.png',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Kembalikan respons dari cache jika ada
      if (response) {
        return response;
      }
      // Coba fetch dari jaringan, tangani error jika offline
      return fetch(event.request).catch(() => {
        // Opsional: Kembalikan halaman fallback atau respons khusus saat offline
        return caches.match('/index.html'); // Kembalikan index.html sebagai fallback
      });
    })
  );
});