// service-worker.js
const CACHE_NAME = "sattva-cache-v2";
const ASSETS = [
  "./",
  "index.html",
  "gallery.html",
  "join.html",
  "thankyou.html",
  "success.html",
  "login2.html",
  "theme.css",
  "style.css",
  "gallery-style.css",
  "join.css",
  "thank-you.css",
  "success.css",
  "login2.css",
  "script.js",
  "galler.js",
  "join.js",
  "login2.js",
  "logo 1.jpeg"
];

// Install SW & cache assets (best-effort — a missing file won't block install)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        ASSETS.map((url) =>
          cache.add(url).catch((err) => console.log("SW: skip caching", url, err.message))
        )
      );
    })
  );
  self.skipWaiting();
});

// Activate & clear old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch handler (Cache First, then Network)
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cachedRes) => cachedRes || fetch(event.request))
  );
});