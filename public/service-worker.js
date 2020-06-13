const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/dist/bundle.js",
  "/dist/manifest.json",
  "/assets/css/styles.css",
  "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",

  // using fontawesome locally to ensure dependencies are cached as well
  "/assets/css/font-awesome.min.css",
  "/assets/css/fonts/fontawesome-webfont.woff",
  "/assets/css/fonts/fontawesome-webfont.woff2",
  "/assets/css/fonts/fontawesome-webfont.ttf",
  "/assets/css/fonts/fontawesome-webfont.svg",
  "/assets/css/fonts/fontawesome-webfont.eot",
  "/assets/css/fonts/FontAwesome.otf",

  "/dist/assets/icons/icon_96x96.png",
  "/dist/assets/icons/icon_128x128.png",
  "/dist/assets/icons/icon_192x192.png",
  "/dist/assets/icons/icon_256x256.png",
  "/dist/assets/icons/icon_384x384.png",
  "/dist/assets/icons/icon_512x512.png",
];

const STATIC_CACHE = "budget-static-v1";
const RUNTIME_CACHE = "budget-data-v1";

self.addEventListener('install', (event) => {
  event.waitUntil(cacheResources());
});

// Cache static files on install of service worker
async function cacheResources() {
  const cache = await caches.open(STATIC_CACHE);
  await cache.addAll(FILES_TO_CACHE);
  return self.skipWaiting();
}

self.addEventListener('activate', event => {
  event.waitUntil(cleanupCache());
});

// Clean up unused / old caches on activate
async function cleanupCache() {
  const currentCaches = [STATIC_CACHE, RUNTIME_CACHE];
  const keyList = await caches.keys();
  const deletedKeys = keyList
    .filter(key => (!currentCaches.includes(key)));
  for (key in deletedKeys) {
    await caches.delete(deletedKeys[key]);
  }
  return self.clients.claim();
}

self.addEventListener('fetch', event => {
  event.respondWith(fetchResource(event.request));
});

// Fetch resource requested 
async function fetchResource(request) {
  if (request.method !== 'GET') {
    // Only handle get requests - return for all other request types
    return fetch(request);
  }
  try {
    if (request.url.includes('/api/')) {
      // If api request - try to fetch from network first
      return fetchNetworkResource(request);

    } else {
      // fetch from cache
      return caches.match(request);
    }

  } catch (error) {
    // Error fetching resource
    console.log(`Error fetching resource: ${error.message}`);
  }
}

// Fetches a resource from the network and caches it if successful
// - falls back on the application cache if the resource is not found
async function fetchNetworkResource(request) {
  try {
    // Try to load from the network by default
    const networkResponse = await fetch(request);

    // If the response was good, clone it and store it in the cache.
    if (networkResponse.status === 200 || networkResponse.status === 0) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request.url, networkResponse.clone());
    }
    return networkResponse;

  } catch (error) {
    // network error - load resource offline from cache instead
    return caches.match(request);
  }
}