// Customer order page: always try the network first (prices and stock change),
// fall back to the saved copy when offline.
var CACHE_NAME = 'mbo-order-v1';
var CORE = ['./', './manifest.json', '../catalog.js', '../logo-header.png',
  '../fonts/Mukta-400.woff', '../fonts/Mukta-600.woff', '../fonts/Mukta-700.woff', '../fonts/Baloo2-700.woff',
  './img/upi-card.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE_NAME).then(function (c) { return c.addAll(CORE).catch(function () {}); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME && k.indexOf('mbo-order-') === 0; })
      .map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        return hit || (req.mode === 'navigate' ? caches.match('./') : undefined);
      });
    })
  );
});
