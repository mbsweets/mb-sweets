var CACHE_NAME = 'mbmb-billing-v8';
var CORE_ASSETS = [
  './',
  './manifest.json',
  './catalog.js',
  './icon-192.png',
  './icon-512.png',
  './logo-header.png',
  './order-qr.png',
  './fonts/Mukta-400.woff',
  './fonts/Mukta-600.woff',
  './fonts/Mukta-700.woff',
  './fonts/Baloo2-700.woff'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(CORE_ASSETS).catch(function () {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME && k.indexOf('mbmb-billing-') === 0; }).map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

function isPageRequest(req) {
  if (req.mode === 'navigate') return true;
  // shared price list: always try the latest copy first
  if (/\/catalog\.js(\?|$)/.test(req.url)) return true;
  var accept = req.headers.get('accept') || '';
  return accept.indexOf('text/html') !== -1;
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  // only this app's own files; never cache other sites (online order register, WhatsApp, maps…)
  if (new URL(req.url).origin !== self.location.origin) return;

  // App page: network first so updates show immediately; fall back to the saved copy when offline.
  if (isPageRequest(req)) {
    e.respondWith(
      fetch(req).then(function (res) {
        try {
          var copy = res.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(req, copy); });
        } catch (err) {}
        return res;
      }).catch(function () {
        return caches.match(req).then(function (hit) { return hit || caches.match('./'); });
      })
    );
    return;
  }

  // Icons, manifest, fonts: cached copy first for speed, refreshed in the background.
  e.respondWith(
    caches.match(req).then(function (cached) {
      var network = fetch(req).then(function (res) {
        try {
          var copy = res.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(req, copy); });
        } catch (err) {}
        return res;
      }).catch(function () { return cached; });
      return cached || network;
    })
  );
});

// Tapping a notification (e.g. new online order) opens the app on the online orders screen.
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var target = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if ('focus' in c) { try { c.navigate(target); } catch (err) {} return c.focus(); }
      }
      return self.clients.openWindow(target);
    })
  );
});
