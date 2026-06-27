const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

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

// ── API routes ก่อน (ไม่ผ่าน static) ──────────────────────
app.get('/api/skills', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json(SKILLS);
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
