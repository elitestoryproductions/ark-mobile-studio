const CACHE_NAME = 'ark-studio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/all.min.css',
  '/js/app.js',
  '/js/canvas-manager.js',
  '/js/image-editor.js',
  '/js/typography.js',
  '/js/effects.js',
  '/js/undo-redo.js',
  '/js/storage.js',
  '/js/file-upload.js',
  '/lib/fabric.min.js',
  '/lib/html2canvas.min.js',
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
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});