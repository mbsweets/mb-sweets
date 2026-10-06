// Customer order page: always try the network first (prices and stock change),
// fall back to the saved copy when offline.
var CACHE_NAME = 'mbo-order-v2';
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
  // pages are stored once, without the address (?k= hand-over links carry the customer's details)
  var key = req.mode === 'navigate' ? new Request(new URL('./', location.href).href) : req;
  e.respondWith(
    fetch(req).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function (c) { c.put(key, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(key).then(function (hit) {
        return hit || (req.mode === 'navigate' ? caches.match('./') : undefined);
      });
    })
  );
});
