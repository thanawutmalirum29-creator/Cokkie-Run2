// ══════════════════════════════════════════════════════════
// service-worker.js — แคชไฟล์เกมไว้ในเครื่อง (เล่นได้แม้เน็ตหลุด/ช้า)
// ══════════════════════════════════════════════════════════
const CACHE_NAME = 'cookie-run-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/gameData.js',
  '/map.js',
  '/fullscreen.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// อย่าแคช /api/* (ข้อมูลสกิลต้องมาจากเซิฟเวอร์เสมอ กันโกง)
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.pathname.startsWith('/api/')) return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (res && res.status === 200 && e.request.method === 'GET') {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
