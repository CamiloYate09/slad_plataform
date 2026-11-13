/* ============================================================
 *  CityStream Service Worker
 *  Fase 5 — PWA con cache-first para el shell del mismo origen y
 *  offline fallback. Nada de otros origenes ni de las paginas de
 *  sesion pasa por la cache (ver el handler de fetch).
 *
 *  Versionado: incrementar CACHE_VERSION en cada release. El
 *  evento `activate` limpia caches obsoletas automaticamente.
 * ============================================================ */

const CACHE_VERSION = 'v20'; // v20: sin el evento themechange ni reglas muertas de .cta-card::before
const CACHE_NAME = `citystream-${CACHE_VERSION}`;

// Shell estatico: archivos cacheados en install para offline-first
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/static/css/style.min.css',
  '/static/js/main.js',
  '/static/img/logo-citystream.png',
  '/image/favicon-32x32.png',
  '/image/apple-touch-icon.png',
  '/image/android-chrome-192x192.png',
  '/manifest.webmanifest',
  '/privacidad.html',
  '/terminos.html'
];

// Paginas de autenticacion: siempre de la red. Muestran el estado de sesion
// actual y /reset-password/ lleva el token en la URL (no debe guardarse).
const AUTH_PAGES = ['/login', '/registro', '/cuenta', '/olvide-password', '/reset-password'];

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

function isAuthPage(url) {
  // GitHub Pages sirve /login, /login.html, /reset-password/ y /reset-password/index.html
  const path = url.pathname.replace(/(\/index)?\.html$/, '').replace(/\/$/, '');
  return AUTH_PAGES.includes(path);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1. Otros origenes (api.citystream.tech, Google, analytics) y paginas de
  //    sesion: SIEMPRE red. Las librerias se sirven desde static/vendor, asi que
  //    nada externo necesita cache; cachearlo guardaba respuestas con datos de
  //    usuario, como la de /auth/me.
  if (url.origin !== self.location.origin || isAuthPage(url)) {
    return; // dejar que el navegador maneje
  }

  // 2. Mismo origen: cache-first con network update en background
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

// El payload del push decide a donde navegar: solo se aceptan rutas de este
// sitio, para que un push no pueda abrir una pagina ajena con nuestra marca.
function sameOriginUrl(raw) {
  try {
    const u = new URL(raw || '/', self.location.origin);
    if (u.origin === self.location.origin) return u.href;
  } catch {
    // URL invalida: se usa la portada
  }
  return self.location.origin + '/';
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = sameOriginUrl(event.notification.data && event.notification.data.url);
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((wins) => {
      const existing = wins.find((w) => w.url.startsWith(self.location.origin));
      if (existing) { existing.focus(); existing.navigate(url); return; }
      self.clients.openWindow(url);
    })
  );
});
