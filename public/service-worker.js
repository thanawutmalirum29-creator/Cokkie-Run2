// ══════════════════════════════════════════════════════════
// service-worker.js — แคชไฟล์เกมไว้ในเครื่อง (เล่นได้แม้เน็ตหลุด/ช้า)
// + รองรับแจ้งอัปเดตให้ผู้เล่นกดโหลดเวอร์ชันใหม่เอง (ไม่สวมทับเงียบๆ)
// ══════════════════════════════════════════════════════════
// 🔔 ทุกครั้งที่อัปเดตไฟล์เกม ให้เปลี่ยนเลขเวอร์ชันนี้ (v1 → v2 → v3 ...)
// เพื่อบังคับให้ตรวจพบไฟล์ใหม่และแจ้งผู้เล่น
const CACHE_NAME = 'cookie-run-v2.0.1';
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
  // ⚠️ ไม่เรียก self.skipWaiting() ที่นี่ — รอให้ผู้เล่นกดยืนยันอัปเดตก่อน
  // (ดูตอนรับ message ด้านล่าง)
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// รับคำสั่งจากหน้าเว็บตอนผู้เล่นกด "อัปเดตเลย" → ค่อย skipWaiting จริง
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
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

