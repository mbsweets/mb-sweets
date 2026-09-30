var CACHE_NAME = 'mbmb-billing-v10';
var CORE_ASSETS = [
  './',
  './manifest.json',
  './catalog.js',
  './icon-192.png',
  './icon-512.png',
  './logo-header.png',
  './order-qr.png',
  './badge-96.png',
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
  // register code for the setup page: always straight from the network, never a saved copy
  if (/\/Code\.gs\.txt(\?|$)/.test(req.url)) return;

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

/* ---------- 🔔 घंटी: नया ऑनलाइन ऑर्डर / दूध-दही रिमाइंडर (रजिस्टर से web push) ----------
   संदेश push के साथ आता है; अगर खाली घंटी आए तो रजिस्टर से पिछले संदेश पढ़ लेते हैं।
   रजिस्टर का पता और चाबी बिलिंग ऐप 'mbmb-cfg' cache में रखता है। */
function readCfg() {
  return caches.open('mbmb-cfg').then(function (c) { return c.match('cfg'); })
    .then(function (r) { return r ? r.json() : null; }).catch(function () { return null; });
}
function b64uToU8(s) {
  s = String(s || '').replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  var bin = atob(s), u = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}
function markSeen(id) {
  return caches.open('mbmb-cfg').then(function (c) {
    return c.match('seen').then(function (x) { return x ? x.text() : '0'; }).then(function (old) {
      var v = Math.max(Number(old) || 0, Number(id) || 0);
      return c.put('seen', new Response(String(v))).then(function () { return Number(old) || 0; });
    });
  }).catch(function () { return 0; });
}
function showItem(d, quiet) {
  var tag = d.g || ('n' + (d.i || Date.now()));
  return self.registration.showNotification(d.t || 'MB Sweets', {
    body: d.b || '', tag: tag, renotify: !quiet && !d.s, silent: !!(quiet || d.s),
    icon: 'icon-192.png', badge: 'badge-96.png', timestamp: Number(d.i) || Date.now(),
    data: { url: d.u || './' }
  });
}
var GENERIC = { t: 'MB Sweets', b: 'नया अपडेट आया है — ऐप खोलकर देखें', u: './#online' };
self.addEventListener('push', function (e) {
  var d = null;
  try { d = e.data ? e.data.json() : null; } catch (err) { d = null; }
  if (d && d.t) {
    e.waitUntil(markSeen(d.i).then(function () { return showItem(d); }));
    return;
  }
  e.waitUntil(readCfg().then(function (c) {
    if (!c || !c.u || !c.k) throw new Error('nocfg');
    return fetch(c.u + '?action=inbox&key=' + encodeURIComponent(c.k), { redirect: 'follow' }).then(function (r) { return r.json(); });
  }).then(function (r) {
    var items = (r && r.items) || [];
    var max = items.reduce(function (m, it) { return Math.max(m, Number(it.i) || 0); }, 0);
    return markSeen(max).then(function (seen) {
      var fresh = items.filter(function (it) { return (Number(it.i) || 0) > seen; });
      if (fresh.length) return Promise.all(fresh.slice(-4).map(function (it) { return showItem(it); }));
      if (items.length) return showItem(items[items.length - 1], true);
      return showItem(GENERIC);
    });
  }).catch(function () { return showItem(GENERIC); }));
});
// Chrome कभी-कभी घंटी का पता बदल देता है — नया पता अपने-आप रजिस्टर को भेज दो
self.addEventListener('pushsubscriptionchange', function (e) {
  e.waitUntil(readCfg().then(function (c) {
    if (!c || !c.u || !c.k || !c.v) return;
    return self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64uToU8(c.v) }).then(function (sub) {
      return fetch(c.u, { method: 'POST', redirect: 'follow',
        body: JSON.stringify({ action: 'pushsub', key: c.k, sub: sub.toJSON(), old: e.oldSubscription ? e.oldSubscription.endpoint : '' }) });
    });
  }).catch(function () {}));
});
