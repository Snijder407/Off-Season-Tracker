// Keeps the app working offline. Bump VERSION whenever you change a file.
const VERSION = 'off-season-v1';
const FILES = ['./', 'index.html', 'manifest.webmanifest',
  'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/favicon-32.png',
  'fonts/jost-400-Book.woff', 'fonts/jost-400-BookItalic.woff', 'fonts/jost-500-Medium.woff',
  'fonts/jost-600-Semi.woff', 'fonts/jost-700-Bold.woff', 'fonts/jost-800-Heavy.woff'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network first (so updates show up), cached copy when offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
