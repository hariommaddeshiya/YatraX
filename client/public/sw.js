// YatraX Production Service Worker - Offline-First PWA Engine
const CACHE_VERSION = 'v3';
const CACHE_SHELL = `yatrax-shell-${CACHE_VERSION}`;
const CACHE_STATIC = `yatrax-static-${CACHE_VERSION}`;
const CACHE_IMAGES = `yatrax-images-${CACHE_VERSION}`;

// Precache list injected by Vite build plugin or defaults for dev
const PRECACHE_ASSETS = self.__SW_PRECACHE_ASSETS__ || [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg'
];

// ==========================================
// INSTALLATION
// ==========================================
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_SHELL).then(async (cache) => {
      console.log('[ServiceWorker] Pre-caching core app shell & assets');
      await Promise.allSettled(
        PRECACHE_ASSETS.map(async (assetUrl) => {
          try {
            const res = await fetch(assetUrl, { cache: 'reload' });
            if (res && res.ok) {
              await cache.put(assetUrl, res);
            }
          } catch (err) {
            console.warn(`[ServiceWorker] Could not pre-cache ${assetUrl}:`, err);
          }
        })
      );
    })
  );
});

// ==========================================
// ACTIVATION & OBSOLETE CACHE CLEANUP
// ==========================================
self.addEventListener('activate', (event) => {
  const expectedCaches = [CACHE_SHELL, CACHE_STATIC, CACHE_IMAGES];
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (!expectedCaches.includes(key)) {
            console.log('[ServiceWorker] Removing obsolete cache version:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ==========================================
// MESSAGE LISTENER (Skip Waiting trigger)
// ==========================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ==========================================
// FETCH EVENT HANDLER & CACHING STRATEGIES
// ==========================================
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 1. Bypass non-GET requests (Never cache POST, PUT, DELETE)
  if (req.method !== 'GET') {
    return;
  }

  // 2. Bypass WebSocket and Socket.IO
  if (url.pathname.startsWith('/socket.io/')) {
    return;
  }

  // 3. SPA Navigation requests (HTML pages: /explore, /trip, /heritage, etc.)
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkRes = await fetch(req);
          if (networkRes && networkRes.ok) {
            const resClone = networkRes.clone();
            caches.open(CACHE_SHELL).then((cache) => {
              cache.put(req, resClone.clone());
              cache.put('/index.html', resClone.clone());
              cache.put('/', resClone);
            });
          }
          return networkRes;
        } catch (err) {
          // Offline fallback: try matched route, index.html, or root
          const cached = (await caches.match(req, { ignoreSearch: true })) ||
                         (await caches.match('/index.html', { ignoreSearch: true })) ||
                         (await caches.match('/', { ignoreSearch: true }));
          if (cached) return cached;

          const shellCache = await caches.open(CACHE_SHELL);
          const shellIndex = (await shellCache.match('/index.html')) || 
                             (await shellCache.match('/'));
          if (shellIndex) return shellIndex;

          // Fail-safe offline HTML response to never return null/undefined
          return new Response(
            '<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>YatraX Offline</title><style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#FAF8F5;color:#1e293b;text-align:center;padding:24px;box-sizing:border-box}.card{background:#fff;padding:32px 24px;border-radius:24px;box-shadow:0 10px 25px rgba(0,0,0,0.06);max-width:360px;width:100%}h2{margin-top:0;color:#064E3B;font-size:22px}p{color:#64748b;font-size:13px;line-height:1.5}button{margin-top:16px;background:#064E3B;color:#fff;border:none;padding:12px 24px;border-radius:16px;font-weight:bold;cursor:pointer;font-size:13px}</style></head><body><div class="card"><h2>YatraX Offline</h2><p>You are currently offline. Check your network or reload to access cached trips.</p><button onclick="window.location.reload()">Reload Application</button></div></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        }
      })()
    );
    return;
  }

  // 4. API Requests (/api/*)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => networkRes)
        .catch(() => {
          return new Response(
            JSON.stringify({
              success: false,
              offline: true,
              message: 'Offline mode: Network request unavailable'
            }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }

  // 5. Images (Unsplash, local media, svgs) -> Cache-First with opaque response support
  const isImage = req.destination === 'image' || 
                  url.hostname.includes('unsplash.com') ||
                  /\.(png|jpg|jpeg|svg|webp|gif|ico)$/i.test(url.pathname);

  if (isImage) {
    event.respondWith(
      (async () => {
        const cached = (await caches.match(req)) || 
                       (await caches.match(req, { ignoreSearch: true }));
        if (cached) return cached;

        try {
          const networkRes = await fetch(req);
          if (networkRes.ok || networkRes.type === 'opaque') {
            const resClone = networkRes.clone();
            const cache = await caches.open(CACHE_IMAGES);
            cache.put(req, resClone);
          }
          return networkRes;
        } catch (err) {
          const fallback = await caches.match('/logo.svg');
          if (fallback) return fallback;
          return new Response('', { status: 404, statusText: 'Image Not In Offline Cache' });
        }
      })()
    );
    return;
  }

  // 6. Static Assets (JS bundles, CSS, Fonts, Leaflet CDN) -> Cache-First with network fallback
  const isStaticAsset = url.pathname.startsWith('/assets/') ||
                        url.hostname.includes('unpkg.com') ||
                        url.hostname.includes('fonts.googleapis.com') ||
                        url.hostname.includes('fonts.gstatic.com') ||
                        /\.(js|css|woff2?|ttf|eot)$/i.test(url.pathname);

  if (isStaticAsset) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(req, { ignoreSearch: true });
        if (cached) return cached;

        try {
          const networkRes = await fetch(req);
          if (networkRes.ok || networkRes.type === 'opaque') {
            const resClone = networkRes.clone();
            const cache = await caches.open(CACHE_STATIC);
            cache.put(req, resClone);
          }
          return networkRes;
        } catch (err) {
          const fuzzy = await caches.match(url.pathname, { ignoreSearch: true });
          if (fuzzy) return fuzzy;
          return new Response('', { status: 404, statusText: 'Offline Asset Not Found' });
        }
      })()
    );
    return;
  }

  // 7. Generic Fallback
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        return await fetch(req);
      } catch (err) {
        return new Response('', { status: 503, statusText: 'Offline' });
      }
    })()
  );
});

