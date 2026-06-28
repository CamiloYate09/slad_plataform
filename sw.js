/* ============================================================
 *  CityStream Service Worker
 *  Fase 5 — PWA con cache-first para shell, network-first para
 *  Supabase, y offline fallback.
 *
 *  Versionado: incrementar CACHE_VERSION en cada release. El
 *  evento `activate` limpia caches obsoletas automaticamente.
 * ============================================================ */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `citystream-${CACHE_VERSION}`;

// Shell estatico: archivos cacheados en install para offline-first
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/static/css/style.css',
  '/static/js/main.js',
  '/static/img/logo-citystream.png',
  '/image/favicon-32x32.png',
  '/image/apple-touch-icon.png',
  '/image/android-chrome-192x192.png',
  '/manifest.webmanifest',
  '/privacidad.html',
  '/terminos.html'
];

// Dominios que se sirven siempre desde la red (no cachear)
const NETWORK_ONLY_HOSTS = [
  'supabase.co',
  'challenges.cloudflare.com',
  'static.cloudflareinsights.com',
  'cloudflareinsights.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // addAll falla atomicamente si cualquier URL falla; usar
      // add individual para tolerar 404s puntuales (ej. AVIF futuro)
      return Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[sw] precache skip', url, err.message);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('citystream-') && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

function isNetworkOnly(url) {
  return NETWORK_ONLY_HOSTS.some((h) => url.hostname.endsWith(h));
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1. Supabase y analytics: SIEMPRE red, sin cache
  if (isNetworkOnly(url)) {
    return; // dejar que el navegador maneje
  }

  // 2. Mismo origen: cache-first con network update en background
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req)
          .then((response) => {
            if (response && response.status === 200 && response.type === 'basic') {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((c) => c.put(req, clone));
            }
            return response;
          })
          .catch(() => null);
        return cached || fetchPromise || caches.match('/offline.html');
      })
    );
    return;
  }

  // 3. CDNs externos (fonts, JS libraries): stale-while-revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

// Mensaje opcional desde el cliente para forzar actualizacion
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Push notification handler — Fase 5 task 16
self.addEventListener('push', (event) => {
  const data = (() => {
    try { return event.data ? event.data.json() : {}; }
    catch { return {}; }
  })();

  const title = data.title || 'CityStream';
  const options = {
    body: data.body || '¡Tenemos novedades!',
    icon: '/image/android-chrome-192x192.png',
    badge: '/image/favicon-32x32.png',
    tag: data.tag || 'citystream-default',
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((wins) => {
      const existing = wins.find((w) => w.url.startsWith(self.location.origin));
      if (existing) { existing.focus(); existing.navigate(url); return; }
      self.clients.openWindow(url);
    })
  );
});
