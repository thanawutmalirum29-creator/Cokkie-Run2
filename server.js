const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// ══════════════════════════════════════════════════════════
// 🔔 จุดเดียวที่ต้องแก้ทุกครั้งที่อัปเดตเกม — ที่อื่นดึงจากตรงนี้หมด
// (แสดงในหน้าเว็บผ่าน /api/version และฝังลงใน service-worker.js
// ตอน serve เพื่อใช้เป็น CACHE_NAME — ไม่ต้องไปแก้ไฟล์ที่ 2 อีก)
// ══════════════════════════════════════════════════════════
const APP_VERSION = 'v0.0.9';

// ══════════════════════════════════════════════════════════
// ข้อมูลสกิล — เก็บไว้ฝั่งเซิฟเวอร์เท่านั้น (ไม่อยู่ในไฟล์ public
// ที่ client โหลดได้ตรงๆ) เพื่อกันการแก้ตัวเลขโกงผ่านไฟล์ฝั่ง client
// ══════════════════════════════════════════════════════════
const SKILLS = {
  yellowJelly: { cooldownSec: 5,  jellyScore: 300 },
  revive:      { reviveHp: 20, hpPerJellies: 1, jelliesPerBonus: 500 },
  dash:        { cooldownSec: 15, durationSec: 4, speedMult: 1.8 },
  jellyBonus:  { bonus: 1 },
  healPotion:  { cooldownSec: 25, healAmount: 3 },
};

// ค่าพลังชีวิตของแต่ละคุกกี้ — ไม่ควรแก้ได้จาก client
const CHAR_STATS = {
  choco:      { maxHp: 70 },
  strawberry: { maxHp: 55 },
  matcha:     { maxHp: 55 },
  vanilla:    { maxHp: 65 },
  blueberry:  { maxHp: 50 },
  ghost:      { maxHp: 88 },
};

// ความเร็ว/ความถี่สิ่งกีดขวางของแต่ละแมพ — กำหนดความยากจริง ไม่ควรแก้ได้จาก client
const MAP_STATS = {
  bakery:   { speed: 5,  obsInterval: 95 },
  candy:    { speed: 6,  obsInterval: 85 },
  icecream: { speed: 7,  obsInterval: 78 },
  forest:   { speed: 8,  obsInterval: 70 },
  lava:     { speed: 10, obsInterval: 60 },
  space:    { speed: 9,  obsInterval: 65 },
};

// ── API routes ก่อน (ไม่ผ่าน static) ──────────────────────
app.get('/api/skills', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ skills: SKILLS, charStats: CHAR_STATS, mapStats: MAP_STATS });
});

// ── เวอร์ชันแอป — ค่ากลางค่าเดียวให้ทุก client โชว์ตรงกัน ──
app.get('/api/version', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ version: APP_VERSION });
});

// ── serve service-worker.js แบบ dynamic — ฝัง APP_VERSION ลงไปแทน
// placeholder __APP_VERSION__ ในไฟล์ ทำให้ CACHE_NAME ตรงกับเวอร์ชัน
// จริงเสมอ โดยไม่ต้องไปแก้ไฟล์นี้แยกอีกที ──
app.get('/service-worker.js', (req, res) => {
  fs.readFile(path.join(__dirname, 'public', 'service-worker.js'), 'utf8', (err, content) => {
    if (err) return res.status(500).end();
    res.set('Content-Type', 'application/javascript');
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.send(content.replace(/__APP_VERSION__/g, APP_VERSION));
  });
});

// ── Root + alias ก่อน static — ได้ no-cache header แน่นอน ──
app.get('/',      (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/lobby', (req, res) => res.redirect('/'));
app.get('/game',  (req, res) => res.redirect('/'));

// ── no-cache สำหรับไฟล์ .html ที่ serve ผ่าน static ──────
app.use((req, res, next) => {
  if (req.path.endsWith('.html')) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`🍪 Cookie Run server running on port ${PORT}`);
  console.log(`   http://localhost:${PORT}`);
});
