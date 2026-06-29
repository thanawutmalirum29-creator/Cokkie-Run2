const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { Pool } = require('pg'); // npm install pg
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const APP_VERSION = 'v0.1.5';


// ══════════════════════════════════════════════════════════
// Database — Railway จะมี env var DATABASE_URL ให้อัตโนมัติ
// ตอนแนบ Postgres plugin เข้ากับโปรเจกต์ (ไม่ต้องตั้งเอง)
// ══════════════════════════════════════════════════════════
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS runs (
      token       UUID PRIMARY KEY,
      char_id     TEXT NOT NULL,
      map_id      TEXT NOT NULL,
      started_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
      used        BOOLEAN NOT NULL DEFAULT false
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leaderboard (
      id          SERIAL PRIMARY KEY,
      player_name TEXT NOT NULL,
      score       INTEGER NOT NULL,
      char_id     TEXT NOT NULL,
      map_id      TEXT NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}
initDb().catch(err => console.error('DB init error:', err));


// ข้อมูลสกิล — เก็บไว้ฝั่งเซิฟเวอร์เท่านั้น (ไม่อยู่ในไฟล์ public
// ที่ client โหลดได้ตรงๆ) เพื่อกันการแก้ตัวเลขโกงผ่านไฟล์ฝั่ง client
// ══════════════════════════════════════════════════════════
// หมายเหตุ: ชื่อฟิลด์ต้องตรงกับที่ public/gameData.js (SKILLS_FALLBACK) และ
// public/game.html ใช้งานจริงเป๊ะๆ ไม่งั้นค่าที่ตั้งตรงนี้จะไม่มีผลกับเกมเลย
// (เคยมีบั๊กแบบนี้มาก่อน: yellowJelly/jellyBonus/healPotion ใช้ชื่อฟิลด์ไม่ตรงกัน
// เลยใช้ค่า fallback ของ client เสมอ ไม่ว่าจะแก้ค่าตรงนี้ยังไงก็ตาม)
const SKILLS = {
  yellowJelly: { spawnEvery: 25, bonusScore: 5 },      // ทุกๆ N เยลลี่ที่เก็บได้ จะมีหมีเยลลี่โบนัสโผล่มา (+bonusScore แต้ม)
  revive:      { reviveHp: 20, hpPerJellies: 1, jelliesPerBonus: 500 },
  dash:        { cooldownSec: 15, durationSec: 4, speedMult: 1.8 },
  jellyBonus:  { bonusPoints: 5 },                     // เก็บเยลลี่ปกติได้คะแนนเพิ่ม +bonusPoints ต่อลูก
  healPotion:  { spawnRate: 180, healAmount: 3 },      // spawnRate = เฉลี่ย 1 ครั้งทุกๆ N เฟรม (สุ่ม ไม่ใช่ตายตัว)
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

// ══════════════════════════════════════════════════════════
// ANTI-CHEAT: ตรวจคะแนนตอนส่งขึ้น leaderboard
// แทนที่จะคำนวณเกมทุกเฟรมฝั่งเซิฟเวอร์ (ต้องเขียนเกมใหม่ทั้งระบบ)
// เราคำนวณ "เพดานคะแนนสูงสุดที่เป็นไปได้จริง" จากเวลาที่เล่นจริง
// (วัดจาก started_at บน server เอง ไม่เชื่อเวลาที่ client ส่งมา)
// แล้ว reject คะแนนที่เกินเพดานนี้ — ตัวเลขนี้ตั้งใจให้ "หลวมพอ"
// (สูงกว่าที่คนเล่นเก่งจริงๆทำได้หลายเท่า) เพื่อไม่ block คนเล่นปกติ
// แต่ยังจับคนอมตะ/โกง magnet/แก้ speed ที่ปั่นคะแนนเกินจริงได้
// ══════════════════════════════════════════════════════════
const MAX_SCORE_PER_SEC = 45;   // ดูค่า passive(0.13*60=7.8/วิ) + เก็บเยลลี่/สกิลถี่ๆ แล้วคูณกันชน
const SCORE_FLAT_BUFFER = 50;   // กันพลาดช่วงวินาทีแรกๆ/ความหน่วงเครือข่าย
const MIN_RUN_SEC = 1;          // กันส่งคะแนนโดยไม่ได้เล่นจริง (เรียก submit ตรงๆ)
const MAX_RUN_SEC = 60 * 60;    // เกิน 1 ชม. ถือว่าผิดปกติ ไม่รับ

function isValidCharMap(charId, mapId) {
  return Object.prototype.hasOwnProperty.call(CHAR_STATS, charId)
      && Object.prototype.hasOwnProperty.call(MAP_STATS, mapId);
}

// เริ่มรอบเล่น — server บันทึกเวลาเริ่มของจริง (ไม่เชื่อเวลาจาก client)
app.post('/api/run/start', async (req, res) => {
  const { charId, mapId } = req.body || {};
  if (!isValidCharMap(charId, mapId)) {
    return res.status(400).json({ error: 'invalid charId/mapId' });
  }
  const token = crypto.randomUUID();
  try {
    await pool.query(
      'INSERT INTO runs (token, char_id, map_id) VALUES ($1, $2, $3)',
      [token, charId, mapId]
    );
    res.json({ token });
  } catch (err) {
    console.error('run/start error:', err);
    res.status(500).json({ error: 'server error' });
  }
});

// จบรอบเล่น — ตรวจ token + เวลาที่เล่นจริง ก่อนรับขึ้น leaderboard
app.post('/api/run/submit', async (req, res) => {
  const { token, score, playerName } = req.body || {};
  const name = (typeof playerName === 'string' && playerName.trim())
    ? playerName.trim().slice(0, 24) : 'ผู้เล่นนิรนาม';
  const numScore = Math.floor(Number(score));

  if (!token || !Number.isFinite(numScore) || numScore < 0) {
    return res.status(400).json({ error: 'invalid payload' });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM runs WHERE token = $1', [token]);
    const run = rows[0];
    if (!run) return res.status(400).json({ error: 'invalid token' });
    if (run.used) return res.status(400).json({ error: 'token already used' });

    const elapsedSec = (Date.now() - new Date(run.started_at).getTime()) / 1000;
    await pool.query('UPDATE runs SET used = true WHERE token = $1', [token]);

    if (elapsedSec < MIN_RUN_SEC || elapsedSec > MAX_RUN_SEC) {
      return res.status(400).json({ error: 'invalid run duration', accepted: false });
    }

    const maxAllowed = elapsedSec * MAX_SCORE_PER_SEC + SCORE_FLAT_BUFFER;
    if (numScore > maxAllowed) {
      console.warn(`⚠️ คะแนนต้องสงสัย: ${name} ส่ง ${numScore} แต้ม ใน ${elapsedSec.toFixed(1)}s (เพดาน ${maxAllowed.toFixed(0)})`);
      return res.status(400).json({ error: 'score exceeds plausible maximum', accepted: false });
    }

    await pool.query(
      'INSERT INTO leaderboard (player_name, score, char_id, map_id) VALUES ($1, $2, $3, $4)',
      [name, numScore, run.char_id, run.map_id]
    );
    res.json({ accepted: true });
  } catch (err) {
    console.error('run/submit error:', err);
    res.status(500).json({ error: 'server error' });
  }
});

// อ่าน leaderboard
app.get('/api/leaderboard', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  try {
    const { rows } = await pool.query(
      'SELECT player_name, score, char_id, map_id, created_at FROM leaderboard ORDER BY score DESC LIMIT $1',
      [limit]
    );
    res.set('Cache-Control', 'no-store');
    res.json(rows);
  } catch (err) {
    console.error('leaderboard error:', err);
    res.status(500).json({ error: 'server error' });
  }
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


// ใหม่
app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.sendFile(path.join(__dirname, 'public', 'lobby.html'));
});
app.get('/lobby', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.sendFile(path.join(__dirname, 'public', 'lobby.html'));
});
app.get('/game', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

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
