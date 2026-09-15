const CACHE_NAME = 'shadow-network-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/login.html',
  '/register.html',
  '/app.html',
  '/messages.html',
  '/files.html',
  '/community.html',
  '/settings.html',
  '/friends.html',
  '/css/main.css',
  '/css/auth.css',
  '/css/app.css',
  '/css/mobile.css',
  '/js/api.js',
  '/js/auth.js',
  '/js/app.js',
  '/js/files.js',
  '/js/messages.js',
  '/js/friends.js',
  '/js/encryption.js',
  '/pwa/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const isApiRequest = request.url.includes('/api/');
  const isPrivateFileRequest = request.url.includes('/files/') || request.url.includes('/downloads/');
  if (isApiRequest || isPrivateFileRequest) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(request).then((response) => {
        if (response && response.ok && request.url.startsWith(self.location.origin)) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
