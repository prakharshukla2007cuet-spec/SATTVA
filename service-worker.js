// service-worker.js
const CACHE_NAME = "sattva-cache-v1";
const ASSETS = [
  "/",                 // homepage
  "/index.html",
  "/join.html",
  "/thankyou.html",
  "/css/style.css",
  "/js/main.js",
  "/successed-295058.mp3",
  "/images/logo 1.jpeg",      
  "/js/gallery.js",
  "/css/gallery-stle.css",
  "/gallery.html",
  "/css/join.css",
  "/images/ss 1.jpeg",
  "/images/ss 2.jpeg",
  "/images/ss 3.jpeg",
  "/images/ss 4.jpeg",
  "/images/ss 5.jpeg",
  "/images/ss 6.jpeg",  
  "/success.html",
  "//css/thank-you.css",
      
];

// Install SW & cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  console.log("Service Worker installed ✅");
});

// Activate & clear old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  console.log("Service Worker activated ✅");
});

// Fetch handler (Cache First, then Network)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedRes) => {
      return (
        cachedRes ||
        fetch(event.request).catch(() =>
          caches.match("/offline.html") // optional offline fallback
        )
      );
    })
  );
});
