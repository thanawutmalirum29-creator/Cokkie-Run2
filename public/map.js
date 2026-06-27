// ══════════════════════════════════════════════════════════
// map.js — ระบบแมพด้วยรหัส Tile
// ══════════════════════════════════════════════════════════
//
// รหัส Tile (TILE_DEFS):
//   101 = พื้นเรียบ (เยลลี่วางบนพื้นทั้งแถบ)
//   102 = ทางกระโดด 1 รอบ (เยลลี่วางตามตำแหน่งที่กำหนดเอง ดู JELLY_LAYOUTS)
//   103 = หลุม / ช่วงว่าง (ไม่มีเยลลี่, อุปสรรคอากาศ 'pit')
//   104 = อุปสรรคด้านบน / อากาศ (obs ลอยกลางอากาศ, วิ่งลอดได้)
//   105 = อุปสรรคพื้นสูง (obs บนพื้น tall สูง → กระโดด 2 รอบ)
//   106 = อุปสรรคพื้นกว้าง (obs wide, กระโดด 1 รอบ ยาว)
//   107 = เยลลี่พิเศษ (เยลลี่โบนัส วางลอยๆ กลางทาง)
//
// ── แมพของแต่ละ MAP_ID ──────────────────────────────────
// แต่ละแมพเป็น array ของ tile code ที่วางต่อกัน
// ระยะของแต่ละ tile = TILE_WIDTH px (ค่าเริ่มต้น 300px)
// เมื่อเล่นถึงท้ายสุด engine จะวนกลับต้น (loop)
//
// ตัวอย่างอ่านแมพ bakery:
//   [ 101, 101, 102, 104, 101, 103, 105, 101, 107, 101 ]
//   = พื้น พื้น กระโดด1 อุปสรรคอากาศ พื้น หลุม สูง พื้น เยลลี่พิเศษ พื้น
//
// ⭐ ตำแหน่งเยลลี่ทุก tile (101–107) กำหนดมือทั้งหมดที่ TILE_LAYOUTS
//    ไม่มีการคำนวณอัตโนมัติเลย — แก้ตัวเลข x/y ได้อิสระ
// ══════════════════════════════════════════════════════════

const TILE_WIDTH = 320; // ความกว้างของ 1 tile (px)

// ── คำจำกัดความของแต่ละรหัส ─────────────────────────────
const TILE_DEFS = {
  101: { name: 'พื้นเรียบ',          color: '#7a3a10', desc: 'วิ่งตรงๆ เยลลี่บนพื้น' },
  102: { name: 'กระโดด 1 รอบ',       color: '#ff8c00', desc: 'obs สั้น เยลลี่ตามตำแหน่งกำหนดมือ' },
  103: { name: 'หลุม',               color: '#222',    desc: 'ช่องว่าง ข้ามหลุม obs อากาศ' },
  104: { name: 'อุปสรรคอากาศ',       color: '#5050ff', desc: 'obs ลอย วิ่งลอดใต้ได้' },
  105: { name: 'อุปสรรคสูง',         color: '#c0392b', desc: 'obs tall กระโดด 2 รอบ เยลลี่ตามตำแหน่งกำหนดมือ' },
  106: { name: 'อุปสรรคกว้าง',       color: '#8e44ad', desc: 'obs wide กระโดดผ่านแบบยาว' },
  107: { name: 'เยลลี่พิเศษ',        color: '#f1c40f', desc: 'เยลลี่พิเศษลอยกลางทาง +โบนัส' },
};

// ══════════════════════════════════════════════════════════
// TILE_LAYOUTS — ตำแหน่งเยลลี่ทุก tile กำหนดมือทั้งหมด
// ══════════════════════════════════════════════════════════
//
// ทุก tile มี layout เป็น array ของจุดเยลลี่
// ตำแหน่งอ้างอิงจาก "ต้น tile" (tileStart = 0)
//
//   x   : ระยะจากต้น tile (px)  ช่วง 0–TILE_WIDTH (320)
//   y   : ความสูงจากพื้น (px)    0 = พื้น, ยิ่งมาก = ยิ่งสูง
//   r   : รัศมีเยลลี่ (ไม่ระบุ = 10)
//   val : คะแนน (ไม่ระบุ = 7)
//   special : true = เยลลี่โบนัส (สีทอง, val ใช้ค่าพิเศษ)
//
// tile 103 (หลุม) ไม่มีเยลลี่เลย — วางแค่ obs
// ══════════════════════════════════════════════════════════

const TILE_LAYOUTS = {

  // ── 101: พื้นเรียบ ──────────────────────────────────────
  101: [
    { x:  20, y:  0 },
    { x:  52, y:  0 },
    { x:  84, y:  0 },
    { x: 116, y:  0 },
    { x: 148, y:  0 },
    { x: 180, y:  0 },
    { x: 212, y:  0 },
    { x: 244, y:  0 },
    { x: 276, y:  0 },
    { x: 300, y:  0 },
  ],

  // ── 102: obs สั้น กระโดด 1 ครั้ง ───────────────────────
  // obs อยู่ที่ x ≈ 144 (TILE_WIDTH*0.45)
  102: [
    { x:  54, y:  0 },
    { x:  84, y: 40 },
    { x: 114, y: 70 },
    { x: 144, y: 85 },
    { x: 174, y: 70 },
    { x: 204, y: 40 },
    { x: 266, y:  0 },
  ],

  // ── 103: หลุม — ไม่มีเยลลี่ ────────────────────────────
  103: [],

  // ── 104: อุปสรรคอากาศ (obs ลอย วิ่งลอดใต้ได้) ─────────
  // obs อยู่ที่ x ≈ 160 (TILE_WIDTH*0.5) → เว้นช่วงนั้น
  104: [
    { x:  20, y:  0 },
    { x:  52, y:  0 },
    { x:  84, y:  0 },
    { x: 116, y:  0 },
    { x: 244, y:  0 },
    { x: 276, y:  0 },
    { x: 300, y:  0 },
  ],

  // ── 105: obs สูง กระโดด 2 ครั้ง (double jump) ──────────
  // obs อยู่ที่ x ≈ 144 (TILE_WIDTH*0.45)
  105: [
    { x:  20, y:   0 },
    { x:  52, y:  40 },
    { x:  82, y:  75 },
    { x: 112, y: 105 },
    { x: 139, y: 130 },
    { x: 169, y: 125 },
    { x: 199, y: 105 },
    { x: 229, y:  75 },
    { x: 259, y:  40 },
    { x: 300, y:   0 },
  ],

  // ── 106: obs กว้าง กระโดดยาว 1 ครั้ง ───────────────────
  // obs อยู่ที่ x ≈ 128 (TILE_WIDTH*0.4)
  106: [
    { x:  18, y:  0 },
    { x:  50, y: 40 },
    { x:  88, y: 65 },
    { x: 128, y: 85 },
    { x: 168, y: 80 },
    { x: 203, y: 65 },
    { x: 238, y: 40 },
    { x: 300, y:  0 },
  ],

  // ── 107: เยลลี่พิเศษลอยกลางอากาศ ───────────────────────
  107: [
    { x:  20, y:  0 },
    { x:  84, y:  0 },
    { x:  96, y: 100, r: 13, val: 15, special: true },
    { x: 160, y: 100, r: 13, val: 15, special: true },
    { x: 224, y: 100, r: 13, val: 15, special: true },
    { x: 236, y:  0 },
    { x: 300, y:  0 },
  ],
};

// ══════════════════════════════════════════════════════════
// MAP PATTERNS — แก้ไขได้อิสระ, แต่ละบรรทัดคือ 1 แมพ
// ══════════════════════════════════════════════════════════

const MAP_PATTERNS = {

  // ── เบเกอรี่ (แมพเริ่มต้น) ─────────────────────────────
  bakery: [
    101, 101, 102, 101, 104, 101,
    101, 102, 101, 105, 101, 101,
    103, 101, 101, 106, 101, 107,
    101, 101, 102, 101, 104, 101,
  ],

  // ── แลนด์ขนม ────────────────────────────────────────────
  candy: [
    101, 102, 101, 104, 101, 102,
    105, 101, 107, 101, 103, 101,
    101, 106, 101, 101, 102, 104,
    101, 101, 105, 101, 107, 101,
  ],

  // ── ไอศกรีม ─────────────────────────────────────────────
  icecream: [
    101, 101, 102, 103, 101, 105,
    101, 104, 101, 107, 101, 102,
    101, 106, 101, 101, 103, 101,
    102, 101, 104, 101, 101, 105,
  ],

  // ── ป่าคุกกี้ ────────────────────────────────────────────
  forest: [
    101, 103, 101, 102, 105, 101,
    104, 101, 101, 106, 101, 107,
    101, 102, 103, 101, 101, 104,
    101, 105, 101, 101, 106, 101,
  ],

  // ── ภูเขาไฟ (ยากสุด) ────────────────────────────────────
  lava: [
    102, 103, 105, 101, 106, 104,
    101, 103, 102, 105, 101, 107,
    103, 106, 101, 105, 104, 101,
    102, 103, 101, 105, 106, 104,
  ],

  // ── อวกาศ ────────────────────────────────────────────────
  space: [
    101, 104, 101, 103, 102, 105,
    101, 107, 101, 106, 101, 104,
    103, 101, 105, 101, 102, 101,
    104, 101, 103, 106, 101, 107,
  ],
};

// ══════════════════════════════════════════════════════════
// buildWorldPlanFromPattern(mapId) → worldPlan[]
// แปลง MAP_PATTERNS[mapId] เป็น array ที่ engine index.html ใช้
// ══════════════════════════════════════════════════════════
function buildWorldPlanFromPattern(mapId, mapSpeed, maxHp) {
  const pattern = MAP_PATTERNS[mapId] || MAP_PATTERNS['bakery'];
  const plan = [];

  const GROUND = 310;
  const GW     = 800;
  const CH     = 48;

  const HP_TICK_FRAMES = 120;
  const FALLBACK_HP    = 70;
  const SAFETY_MULT    = 3;

  const hp  = (typeof maxHp    === 'number' && maxHp    > 0) ? maxHp    : FALLBACK_HP;
  const spd = (typeof mapSpeed === 'number' && mapSpeed > 0) ? mapSpeed : 5;

  const guaranteedDistancePx = hp * HP_TICK_FRAMES * spd;
  const requiredDistancePx   = guaranteedDistancePx * SAFETY_MULT;
  const patternDistancePx    = pattern.length * TILE_WIDTH;
  const repeatCount          = Math.max(1, Math.ceil(requiredDistancePx / patternDistancePx));

  // ── ฟังก์ชันวางเยลลี่จาก TILE_LAYOUTS ──────────────────
  // tileStart = worldX ของต้น tile
  function placeTileJellies(tileStart, code) {
    const layout = TILE_LAYOUTS[code] || TILE_LAYOUTS[101];
    for (const pt of layout) {
      const wx  = tileStart + pt.x;
      const y   = GROUND - CH / 2 - (pt.y || 0);
      const r   = pt.r   || 10;
      const val = pt.val || 7;
      plan.push({
        worldX: wx, kind: 'jel', y, r,
        bob: (wx % 8) * 0.4, val, trail: true,
        special: pt.special || false,
      });
    }
  }

  // ── ฟังก์ชันวาง obstacle ────────────────────────────────
  function placeTileObs(tileStart, code) {
    switch (code) {
      case 102: {
        const wx = tileStart + TILE_WIDTH * 0.45;
        plan.push({ worldX: wx, kind: 'obs', w: 28, h: 44, y: GROUND - 44, type: 'short' });
        break;
      }
      case 103: {
        const wx = tileStart + TILE_WIDTH * 0.5;
        plan.push({ worldX: wx, kind: 'obs', w: 80, h: 22, y: GROUND - 130, type: 'air' });
        break;
      }
      case 104: {
        const wx = tileStart + TILE_WIDTH * 0.5;
        plan.push({ worldX: wx, kind: 'obs', w: 36, h: 22, y: GROUND - 140, type: 'air' });
        break;
      }
      case 105: {
        const wx = tileStart + TILE_WIDTH * 0.45;
        plan.push({ worldX: wx, kind: 'obs', w: 28, h: 80, y: GROUND - 80, type: 'tall' });
        break;
      }
      case 106: {
        const wx = tileStart + TILE_WIDTH * 0.4;
        plan.push({ worldX: wx, kind: 'obs', w: 65, h: 28, y: GROUND - 28, type: 'wide' });
        break;
      }
      // 101, 107 ไม่มี obs
    }
  }

  let curWX = GW + 300;

  for (let rep = 0; rep < repeatCount; rep++) {
    for (let i = 0; i < pattern.length; i++) {
      const code = pattern[i];
      placeTileObs(curWX, code);
      placeTileJellies(curWX, code);
      curWX += TILE_WIDTH;
    }
  }

  plan.sort((a, b) => a.worldX - b.worldX);
  return plan;
}
