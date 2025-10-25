// service-worker.js
const CACHE_NAME = 'lastwar743-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/contact.html',
  '/script/main.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  console.log('✅ Last War 743 PWA installed!');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});