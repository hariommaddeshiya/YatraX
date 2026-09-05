// YatraX Production Service Worker - Offline-First PWA Engine
const CACHE_VERSION = 'v2';
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
  event.waitUntil(
    caches.open(CACHE_SHELL).then(async (cache) => {
      console.log('[ServiceWorker] Pre-caching core app shell & assets');
      try {
        await cache.addAll(PRECACHE_ASSETS);
      } catch (err) {
        console.warn('[ServiceWorker] Some pre-cache assets could not be cached immediately:', err);
      }
    })
  );
  self.skipWaiting();
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
          if (!expectedCaches.includes(key) && key.startsWith('yatrax-')) {
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
      fetch(req)
        .then((networkRes) => {
          // Cache successful navigation HTML in shell cache
          if (networkRes.ok) {
            const resClone = networkRes.clone();
            caches.open(CACHE_SHELL).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(async () => {
          // Offline fallback: serve cached index.html
          const cachedPage = await caches.match(req);
          if (cachedPage) return cachedPage;
          const shellIndex = await caches.match('/index.html');
          if (shellIndex) return shellIndex;
          return caches.match('/');
        })
    );
    return;
  }

  // 4. API Requests (/api/*)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          return networkRes;
        })
        .catch(async () => {
          // Return clean offline response for frontend catch blocks
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

  // 5. Images (Unsplash, local media, svgs) -> Cache-First
  const isImage = req.destination === 'image' || 
                  url.hostname.includes('unsplash.com') ||
                  /\.(png|jpg|jpeg|svg|webp|gif|ico)$/i.test(url.pathname);

  if (isImage) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        if (cachedRes) return cachedRes;

        return fetch(req)
          .then((networkRes) => {
            if (networkRes.ok) {
              const resClone = networkRes.clone();
              caches.open(CACHE_IMAGES).then((cache) => cache.put(req, resClone));
            }
            return networkRes;
          })
          .catch(() => {
            // Optional fallback placeholder
            return caches.match('/logo.svg');
          });
      })
    );
    return;
  }

  // 6. Static Assets (JS bundles, CSS, Fonts, Leaflet CDN) -> Stale-While-Revalidate / Cache-First
  const isStaticAsset = url.pathname.startsWith('/assets/') ||
                        url.hostname.includes('unpkg.com') ||
                        url.hostname.includes('fonts.googleapis.com') ||
                        url.hostname.includes('fonts.gstatic.com') ||
                        /\.(js|css|woff2?|ttf|eot)$/i.test(url.pathname);

  if (isStaticAsset) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        const fetchPromise = fetch(req)
          .then((networkRes) => {
            if (networkRes.ok) {
              const resClone = networkRes.clone();
              caches.open(CACHE_STATIC).then((cache) => cache.put(req, resClone));
            }
            return networkRes;
          })
          .catch(() => null);

        // Return cached asset immediately if available, else wait for network
        return cachedRes || fetchPromise;
      })
    );
    return;
  }

  // 7. Generic Fallback
  event.respondWith(
    caches.match(req).then((cachedRes) => {
      return cachedRes || fetch(req).catch(() => null);
    })
  );
});

