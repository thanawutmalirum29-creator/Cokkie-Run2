// ══════════════════════════════════════════════════════════
// map.js — ระบบแมพด้วยรหัส Tile
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
  108: { name: 'ขวดเลือดใหญ่',       color: '#e53935', desc: 'ฮีลเลือด +20 หน่วย' },
  109: { name: 'ขวดเลือดเล็ก',       color: '#ef9a9a', desc: 'ฮีลเลือด +5 หน่วย' },
  110: { name: 'ลูกไฟ',              color: '#ff6d00', desc: 'พุ่งไปข้างหน้า 4 วิ ทำลายสิ่งกีดขวาง' },
  111: { name: 'แม่เหล็ก',           color: '#7c4dff', desc: 'ดูดเยลลี่รอบตัวในระยะ 6 วิ' },
};



const MAP_TILE_LAYOUTS = {

 
  bakery: {
    101: [ {x:0,y:0},{x:35,y:0},{x:70,y:0},{x:105,y:0},{x:140,y:0},{x:175,y:0},{x:210,y:0},{x:245,y:0},{x:280,y:0},],
    102: [ {x:0,y:0},{x:35,y:0},{x:70,y:40},{x:105,y:70},{x:160,y:85},{x:210,y:70},{x:245,y:40},{x:280,y:0} ],
    103: [],
    104: [
      { x:  20, y: 0 }, { x:  52, y: 0 }, { x:  84, y: 0 }, { x: 116, y: 0 },
      { x: 244, y: 0 }, { x: 276, y: 0 }, { x: 300, y: 0 },
    ],
    105: [
      { x:  20, y:   0 }, { x:  52, y:  40 }, { x:  82, y:  75 },
      { x: 112, y: 105 }, { x: 139, y: 130 }, { x: 169, y: 125 },
      { x: 199, y: 105 }, { x: 229, y:  75 }, { x: 259, y:  40 }, { x: 300, y: 0 },
    ],
    106: [
      { x:  18, y:  0 }, { x:  50, y: 40 }, { x:  88, y: 65 },
      { x: 128, y: 85 }, { x: 168, y: 80 }, { x: 203, y: 65 },
      { x: 238, y: 40 }, { x: 300, y:  0 },
    ],
    107: [
      { x:  20, y:   0 }, { x:  84, y:   0 },
      { x:  96, y: 100, r: 13, val: 15, special: true },
      { x: 160, y: 100, r: 13, val: 15, special: true },
      { x: 224, y: 100, r: 13, val: 15, special: true },
      { x: 236, y:   0 }, { x: 300, y:   0 },
    ],
    108: [ { x: 160, y: 60, item: 'hpLarge' } ],
    109: [ { x: 160, y: 60, item: 'hpSmall' } ],
    110: [ { x: 160, y: 60, item: 'fireball' } ],
    111: [ { x: 160, y: 60, item: 'magnet'  } ],
  },
  // ════════════════════════════════════════════════════════
  candy: {
    101: [
      { x:  20, y: 0 }, { x:  52, y: 0 }, { x:  84, y: 0 },
      { x: 116, y: 0 }, { x: 148, y: 0 }, { x: 180, y: 0 },
      { x: 212, y: 0 }, { x: 244, y: 0 }, { x: 276, y: 0 }, { x: 300, y: 0 },
    ],
    102: [
      { x:  54, y:  0 },
      { x:  84, y: 40 },
      { x: 114, y: 70 },
      { x: 144, y: 85 },
      { x: 174, y: 70 },
      { x: 204, y: 40 },
      { x: 266, y:  0 },
    ],
    103: [],
    104: [
      { x:  20, y: 0 }, { x:  52, y: 0 }, { x:  84, y: 0 }, { x: 116, y: 0 },
      { x: 244, y: 0 }, { x: 276, y: 0 }, { x: 300, y: 0 },
    ],
    105: [
      { x:  20, y:   0 }, { x:  52, y:  40 }, { x:  82, y:  75 },
      { x: 112, y: 105 }, { x: 139, y: 130 }, { x: 169, y: 125 },
      { x: 199, y: 105 }, { x: 229, y:  75 }, { x: 259, y:  40 }, { x: 300, y: 0 },
    ],
    106: [
      { x:  18, y:  0 }, { x:  50, y: 40 }, { x:  88, y: 65 },
      { x: 128, y: 85 }, { x: 168, y: 80 }, { x: 203, y: 65 },
      { x: 238, y: 40 }, { x: 300, y:  0 },
    ],
    107: [
      { x:  20, y:   0 }, { x:  84, y:   0 },
      { x:  96, y: 100, r: 13, val: 15, special: true },
      { x: 160, y: 100, r: 13, val: 15, special: true },
      { x: 224, y: 100, r: 13, val: 15, special: true },
      { x: 236, y:   0 }, { x: 300, y:   0 },
    ],
    108: [ { x: 160, y: 60, item: 'hpLarge' } ],
    109: [ { x: 160, y: 60, item: 'hpSmall' } ],
    110: [ { x: 160, y: 60, item: 'fireball' } ],
    111: [ { x: 160, y: 60, item: 'magnet'  } ],
  },

  // ════════════════════════════════════════════════════════
  // icecream — speed ?
  // ════════════════════════════════════════════════════════
  icecream: {
    101: [
      { x:  20, y: 0 }, { x:  52, y: 0 }, { x:  84, y: 0 },
      { x: 116, y: 0 }, { x: 148, y: 0 }, { x: 180, y: 0 },
      { x: 212, y: 0 }, { x: 244, y: 0 }, { x: 276, y: 0 }, { x: 300, y: 0 },
    ],
    102: [
      { x:  54, y:  0 },
      { x:  84, y: 40 },
      { x: 114, y: 70 },
      { x: 144, y: 85 },
      { x: 174, y: 70 },
      { x: 204, y: 40 },
      { x: 266, y:  0 },
    ],
    103: [],
    104: [
      { x:  20, y: 0 }, { x:  52, y: 0 }, { x:  84, y: 0 }, { x: 116, y: 0 },
      { x: 244, y: 0 }, { x: 276, y: 0 }, { x: 300, y: 0 },
    ],
    105: [
      { x:  20, y:   0 }, { x:  52, y:  40 }, { x:  82, y:  75 },
      { x: 112, y: 105 }, { x: 139, y: 130 }, { x: 169, y: 125 },
      { x: 199, y: 105 }, { x: 229, y:  75 }, { x: 259, y:  40 }, { x: 300, y: 0 },
    ],
    106: [
      { x:  18, y:  0 }, { x:  50, y: 40 }, { x:  88, y: 65 },
      { x: 128, y: 85 }, { x: 168, y: 80 }, { x: 203, y: 65 },
      { x: 238, y: 40 }, { x: 300, y:  0 },
    ],
    107: [
      { x:  20, y:   0 }, { x:  84, y:   0 },
      { x:  96, y: 100, r: 13, val: 15, special: true },
      { x: 160, y: 100, r: 13, val: 15, special: true },
      { x: 224, y: 100, r: 13, val: 15, special: true },
      { x: 236, y:   0 }, { x: 300, y:   0 },
    ],
    108: [ { x: 160, y: 60, item: 'hpLarge' } ],
    109: [ { x: 160, y: 60, item: 'hpSmall' } ],
    110: [ { x: 160, y: 60, item: 'fireball' } ],
    111: [ { x: 160, y: 60, item: 'magnet'  } ],
  },

  // ════════════════════════════════════════════════════════
  // forest — speed ?
  // ════════════════════════════════════════════════════════
  forest: {
    101: [
      { x:  20, y: 0 }, { x:  52, y: 0 }, { x:  84, y: 0 },
      { x: 116, y: 0 }, { x: 148, y: 0 }, { x: 180, y: 0 },
      { x: 212, y: 0 }, { x: 244, y: 0 }, { x: 276, y: 0 }, { x: 300, y: 0 },
    ],
    102: [
      { x:  54, y:  0 },
      { x:  84, y: 40 },
      { x: 114, y: 70 },
      { x: 144, y: 85 },
      { x: 174, y: 70 },
      { x: 204, y: 40 },
      { x: 266, y:  0 },
    ],
    103: [],
    104: [
      { x:  20, y: 0 }, { x:  52, y: 0 }, { x:  84, y: 0 }, { x: 116, y: 0 },
      { x: 244, y: 0 }, { x: 276, y: 0 }, { x: 300, y: 0 },
    ],
    105: [
      { x:  20, y:   0 }, { x:  52, y:  40 }, { x:  82, y:  75 },
      { x: 112, y: 105 }, { x: 139, y: 130 }, { x: 169, y: 125 },
      { x: 199, y: 105 }, { x: 229, y:  75 }, { x: 259, y:  40 }, { x: 300, y: 0 },
    ],
    106: [
      { x:  18, y:  0 }, { x:  50, y: 40 }, { x:  88, y: 65 },
      { x: 128, y: 85 }, { x: 168, y: 80 }, { x: 203, y: 65 },
      { x: 238, y: 40 }, { x: 300, y:  0 },
    ],
    107: [
      { x:  20, y:   0 }, { x:  84, y:   0 },
      { x:  96, y: 100, r: 13, val: 15, special: true },
      { x: 160, y: 100, r: 13, val: 15, special: true },
      { x: 224, y: 100, r: 13, val: 15, special: true },
      { x: 236, y:   0 }, { x: 300, y:   0 },
    ],
    108: [ { x: 160, y: 60, item: 'hpLarge' } ],
    109: [ { x: 160, y: 60, item: 'hpSmall' } ],
    110: [ { x: 160, y: 60, item: 'fireball' } ],
    111: [ { x: 160, y: 60, item: 'magnet'  } ],
  },

  // ════════════════════════════════════════════════════════
  // lava — speed ? (ยากสุด ความเร็วสูงสุด)
  // ════════════════════════════════════════════════════════
  lava: {
    101: [
      { x:  20, y: 0 }, { x:  52, y: 0 }, { x:  84, y: 0 },
      { x: 116, y: 0 }, { x: 148, y: 0 }, { x: 180, y: 0 },
      { x: 212, y: 0 }, { x: 244, y: 0 }, { x: 276, y: 0 }, { x: 300, y: 0 },
    ],
    102: [
      { x:  54, y:  0 },
      { x:  84, y: 40 },
      { x: 114, y: 70 },
      { x: 144, y: 85 },
      { x: 174, y: 70 },
      { x: 204, y: 40 },
      { x: 266, y:  0 },
    ],
    103: [],
    104: [
      { x:  20, y: 0 }, { x:  52, y: 0 }, { x:  84, y: 0 }, { x: 116, y: 0 },
      { x: 244, y: 0 }, { x: 276, y: 0 }, { x: 300, y: 0 },
    ],
    105: [
      { x:  20, y:   0 }, { x:  52, y:  40 }, { x:  82, y:  75 },
      { x: 112, y: 105 }, { x: 139, y: 130 }, { x: 169, y: 125 },
      { x: 199, y: 105 }, { x: 229, y:  75 }, { x: 259, y:  40 }, { x: 300, y: 0 },
    ],
    106: [
      { x:  18, y:  0 }, { x:  50, y: 40 }, { x:  88, y: 65 },
      { x: 128, y: 85 }, { x: 168, y: 80 }, { x: 203, y: 65 },
      { x: 238, y: 40 }, { x: 300, y:  0 },
    ],
    107: [
      { x:  20, y:   0 }, { x:  84, y:   0 },
      { x:  96, y: 100, r: 13, val: 15, special: true },
      { x: 160, y: 100, r: 13, val: 15, special: true },
      { x: 224, y: 100, r: 13, val: 15, special: true },
      { x: 236, y:   0 }, { x: 300, y:   0 },
    ],
    108: [ { x: 160, y: 60, item: 'hpLarge' } ],
    109: [ { x: 160, y: 60, item: 'hpSmall' } ],
    110: [ { x: 160, y: 60, item: 'fireball' } ],
    111: [ { x: 160, y: 60, item: 'magnet'  } ],
  },

  // ════════════════════════════════════════════════════════
  // space — speed ?
  // ════════════════════════════════════════════════════════
  space: {
    101: [
      { x:  20, y: 0 }, { x:  52, y: 0 }, { x:  84, y: 0 },
      { x: 116, y: 0 }, { x: 148, y: 0 }, { x: 180, y: 0 },
      { x: 212, y: 0 }, { x: 244, y: 0 }, { x: 276, y: 0 }, { x: 300, y: 0 },
    ],
    102: [
      { x:  54, y:  0 },
      { x:  84, y: 40 },
      { x: 114, y: 70 },
      { x: 144, y: 85 },
      { x: 174, y: 70 },
      { x: 204, y: 40 },
      { x: 266, y:  0 },
    ],
    103: [],
    104: [
      { x:  20, y: 0 }, { x:  52, y: 0 }, { x:  84, y: 0 }, { x: 116, y: 0 },
      { x: 244, y: 0 }, { x: 276, y: 0 }, { x: 300, y: 0 },
    ],
    105: [
      { x:  20, y:   0 }, { x:  52, y:  40 }, { x:  82, y:  75 },
      { x: 112, y: 105 }, { x: 139, y: 130 }, { x: 169, y: 125 },
      { x: 199, y: 105 }, { x: 229, y:  75 }, { x: 259, y:  40 }, { x: 300, y: 0 },
    ],
    106: [
      { x:  18, y:  0 }, { x:  50, y: 40 }, { x:  88, y: 65 },
      { x: 128, y: 85 }, { x: 168, y: 80 }, { x: 203, y: 65 },
      { x: 238, y: 40 }, { x: 300, y:  0 },
    ],
    107: [
      { x:  20, y:   0 }, { x:  84, y:   0 },
      { x:  96, y: 100, r: 13, val: 15, special: true },
      { x: 160, y: 100, r: 13, val: 15, special: true },
      { x: 224, y: 100, r: 13, val: 15, special: true },
      { x: 236, y:   0 }, { x: 300, y:   0 },
    ],
    108: [ { x: 160, y: 60, item: 'hpLarge' } ],
    109: [ { x: 160, y: 60, item: 'hpSmall' } ],
    110: [ { x: 160, y: 60, item: 'fireball' } ],
    111: [ { x: 160, y: 60, item: 'magnet'  } ],
  },
};

// ══════════════════════════════════════════════════════════
// MAP PATTERNS — แก้ไขได้อิสระ, แต่ละบรรทัดคือ 1 แมพ
// ══════════════════════════════════════════════════════════

const MAP_PATTERNS = {

  // ── เบเกอรี่ (แมพเริ่มต้น) ─────────────────────────────
  bakery: [
    101, 101, 102, 101, 104, 101,
    109, 102, 101, 105, 101, 101,
    103, 101, 110, 106, 101, 107,
    101, 108, 102, 101, 111, 101,
  ],

  // ── แลนด์ขนม ────────────────────────────────────────────
  candy: [
    101, 102, 101, 104, 101, 102,
    105, 109, 107, 101, 103, 101,
    101, 106, 110, 101, 102, 104,
    108, 101, 105, 101, 111, 101,
  ],

  // ── ไอศกรีม ─────────────────────────────────────────────
  icecream: [
    101, 101, 102, 103, 101, 105,
    109, 104, 101, 107, 101, 102,
    101, 106, 110, 101, 103, 101,
    102, 108, 104, 101, 111, 105,
  ],

  // ── ป่าคุกกี้ ────────────────────────────────────────────
  forest: [
    101, 103, 101, 102, 105, 101,
    104, 109, 101, 106, 101, 107,
    101, 102, 103, 110, 101, 104,
    108, 105, 101, 101, 111, 101,
  ],

  // ── ภูเขาไฟ (ยากสุด) ────────────────────────────────────
  lava: [
    102, 103, 105, 108, 106, 104,
    101, 103, 102, 105, 109, 107,
    103, 106, 110, 105, 104, 101,
    102, 103, 111, 105, 106, 104,
  ],

  // ── อวกาศ ────────────────────────────────────────────────
  space: [
    101, 104, 101, 103, 102, 105,
    109, 107, 101, 106, 101, 104,
    103, 110, 105, 101, 102, 101,
    104, 108, 103, 106, 111, 107,
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

  // ── เลือก layout ของแมพนี้ (fallback → bakery) ──────────
  const tileLayouts = MAP_TILE_LAYOUTS[mapId] || MAP_TILE_LAYOUTS['bakery'];

  // ── วางเยลลี่จาก layout ของแมพ ──────────────────────────
  function placeTileJellies(tileStart, code) {
    const layout = tileLayouts[code] || tileLayouts[101] || [];
    for (const pt of layout) {
      // tile 108-111 วาง item ไม่ใช่เยลลี่
      if (pt.item) {
        plan.push({
          worldX: tileStart + pt.x,
          kind: 'item',
          itemType: pt.item,
          y: GROUND - CH / 2 - (pt.y || 0),
        });
        continue;
      }
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

  // ── วาง obstacle ─────────────────────────────────────────
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

// ══════════════════════════════════════════════════════════
// ฉากหลัง + อุปสรรค + ลาย thumbnail เฉพาะของแต่ละแมพ
// (ย้ายมาจาก index.html ให้รวมโค้ด "วาดแมพ" ไว้ที่นี่ทั้งหมด)
// ══════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════
// ฉากหลังเฉพาะของแต่ละแมพ
// parFar / parMid คือค่า accumulator ดิบ (ไม่จำกัด)
// แต่ละ function wrap เองด้วย tileX helper
// ══════════════════════════════════════════════════════════
function drawMapScenery(id, parFar, parMid) {
  switch (id) {
    case 'bakery':   return drawSceneryBakery(parFar, parMid);
    case 'candy':    return drawSceneryCandy(parFar, parMid);
    case 'icecream': return drawSceneryIcecream(parFar, parMid);
    case 'forest':   return drawSceneryForest(parFar, parMid);
    case 'lava':     return drawSceneryLava(parFar, parMid);
    case 'space':    return drawSceneryStars(parFar, parMid);
    default:         return drawSceneryBakery(parFar, parMid);
  }
}

// คืน x เริ่มต้นของ tile แรก (อาจติดลบ) เพื่อให้ครอบจอเสมอ
function tileX(scroll, period) {
  return -(scroll % period);
}

// ── เบเกอรี่ ──
function drawSceneryBakery(parFar, parMid) {
  const pF = 220, pM = 140;
  for (let x = tileX(parFar,pF)-pF; x < GW+pF; x += pF) {
    ctx.fillStyle = 'rgba(255,180,90,0.10)';
    rrectPath(ctx, x, 70, 90, 110, 8); ctx.fill();
    ctx.fillStyle = 'rgba(255,210,140,0.22)';
    rrectPath(ctx, x+10, 85, 70, 40, 4); ctx.fill();
    ctx.fillStyle = 'rgba(255,220,120,0.12)';
    rrectPath(ctx, x+15, 92, 26, 15, 3); ctx.fill();
    rrectPath(ctx, x+49, 92, 24, 15, 3); ctx.fill();
  }
  for (let x = tileX(parMid,pM)-pM; x < GW+pM; x += pM) {
    ctx.fillStyle = 'rgba(120,60,20,0.38)';
    ctx.fillRect(x, GROUND-60, 60, 6);
    ctx.fillStyle = 'rgba(210,150,80,0.45)';
    ctx.beginPath(); ctx.ellipse(x+15, GROUND-70, 12, 9, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+42, GROUND-70, 12, 9, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,200,120,0.15)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x+15,GROUND-80); ctx.quadraticCurveTo(x+10,GROUND-95,x+15,GROUND-110); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+42,GROUND-80); ctx.quadraticCurveTo(x+38,GROUND-95,x+42,GROUND-110); ctx.stroke();
  }
}

// ── แลนด์ขนม ──
function drawSceneryCandy(parFar, parMid) {
  const pF = 260, pM = 150;
  for (let x = tileX(parFar,pF)-pF; x < GW+pF; x += pF) {
    ctx.fillStyle = 'rgba(255,160,210,0.18)';
    ctx.beginPath(); ctx.ellipse(x+120, GROUND-4, 140, 70, 0, Math.PI, 0); ctx.fill();
    ctx.strokeStyle = 'rgba(255,200,230,0.12)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x+60,GROUND-25); ctx.quadraticCurveTo(x+120,GROUND-68,x+180,GROUND-25); ctx.stroke();
  }
  for (let x = tileX(parMid,pM)-pM; x < GW+pM; x += pM) {
    const ly = GROUND-78;
    ctx.strokeStyle = 'rgba(255,255,255,0.38)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x, GROUND-4); ctx.lineTo(x, ly); ctx.stroke();
    const grd = ctx.createRadialGradient(x-4, ly-4, 2, x, ly, 16);
    grd.addColorStop(0,'#fff'); grd.addColorStop(0.45,'#ff9fd0'); grd.addColorStop(1,'#ff2f80aa');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(x, ly, 16, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, ly, 9, 0, Math.PI*1.4); ctx.stroke();
  }
}

// ── ไอศกรีม ──
function drawSceneryIcecream(parFar, parMid) {
  const pF = 230, pM = 140;
  for (let x = tileX(parFar,pF)-pF; x < GW+pF; x += pF) {
    ctx.fillStyle = 'rgba(200,240,255,0.17)';
    ctx.beginPath(); ctx.moveTo(x,GROUND); ctx.lineTo(x+60,GROUND-95); ctx.lineTo(x+120,GROUND); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath(); ctx.moveTo(x+44,GROUND-68); ctx.lineTo(x+60,GROUND-95); ctx.lineTo(x+76,GROUND-68); ctx.closePath(); ctx.fill();
  }
  for (let x = tileX(parMid,pM)-pM; x < GW+pM; x += pM) {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.moveTo(x,GROUND-4); ctx.lineTo(x+7,GROUND-26); ctx.lineTo(x+14,GROUND-4); ctx.closePath(); ctx.fill();
  }
  for (let i = 0; i < 22; i++) {
    const sx = ((i*173 + frame*0.6) % (GW+20) + GW+20) % (GW+20) - 10;
    const sy = ((i*91  + frame*0.4) % (GROUND+10) + GROUND+10) % (GROUND+10) - 5;
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.arc(sx, sy, 1.6, 0, Math.PI*2); ctx.fill();
  }
}

// ── ป่าคุกกี้ ──
function drawSceneryForest(parFar, parMid) {
  const pF = 170, pM = 110;
  for (let x = tileX(parFar,pF)-pF; x < GW+pF; x += pF) {
    ctx.fillStyle = 'rgba(15,45,15,0.32)';
    ctx.beginPath(); ctx.moveTo(x,GROUND-20); ctx.lineTo(x+26,GROUND-130); ctx.lineTo(x+52,GROUND-20); ctx.closePath(); ctx.fill();
  }
  for (let x = tileX(parMid,pM)-pM; x < GW+pM; x += pM) {
    ctx.fillStyle = 'rgba(28,85,22,0.55)';
    ctx.beginPath(); ctx.moveTo(x,GROUND-2); ctx.lineTo(x+18,GROUND-80); ctx.lineTo(x+36,GROUND-2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(65,40,12,0.55)'; ctx.fillRect(x+13,GROUND-12,10,13);
  }
  for (let i = 0; i < 10; i++) {
    const fx = ((i*233 + frame*0.8) % (GW+20) + GW+20) % (GW+20) - 10;
    const fy = GROUND - 40 - (Math.sin(frame*0.04+i)*20+20);
    const glow = 0.28 + 0.42*Math.sin(frame*0.1+i);
    ctx.fillStyle = `rgba(210,255,100,${glow})`;
    ctx.beginPath(); ctx.arc(fx, fy, 2.2, 0, Math.PI*2); ctx.fill();
  }
}

// ── ภูเขาไฟ ──
function drawSceneryLava(parFar, parMid) {
  const pF = 240, pM = 130;
  for (let x = tileX(parFar,pF)-pF; x < GW+pF; x += pF) {
    ctx.fillStyle = 'rgba(0,0,0,0.42)';
    ctx.beginPath(); ctx.moveTo(x,GROUND); ctx.lineTo(x+70,GROUND-110); ctx.lineTo(x+140,GROUND); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,80,0,0.52)';
    ctx.beginPath(); ctx.moveTo(x+55,GROUND-88); ctx.lineTo(x+70,GROUND-110); ctx.lineTo(x+85,GROUND-88); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,120,0,0.28)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x+40,GROUND-40); ctx.lineTo(x+55,GROUND-80); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+88,GROUND-35); ctx.lineTo(x+72,GROUND-75); ctx.stroke();
  }
  for (let x = tileX(parMid,pM)-pM; x < GW+pM; x += pM) {
    ctx.fillStyle = 'rgba(8,4,4,0.58)';
    ctx.beginPath(); ctx.moveTo(x,GROUND); ctx.lineTo(x+14,GROUND-28); ctx.lineTo(x+28,GROUND); ctx.closePath(); ctx.fill();
  }
  for (let i = 0; i < 16; i++) {
    const ex = ((i*191 + frame*1.1) % (GW+20) + GW+20) % (GW+20) - 10;
    const ey = GROUND - ((frame*1.4 + i*37) % (GROUND-40));
    const alpha = Math.max(0, 0.5 - ey/(GROUND*2));
    ctx.fillStyle = `rgba(255,${120+(i%3)*40},0,${alpha})`;
    ctx.beginPath(); ctx.arc(ex, ey, 1.8, 0, Math.PI*2); ctx.fill();
  }
}

// ── อวกาศ ──
function drawSceneryStars(parFar, parMid) {
  const pF = GW+40;
  for (let i = 0; i < 40; i++) {
    const sx = ((i*137 - parFar*0.3) % pF + pF) % pF - 20;
    const sy = (i*53+11) % (GROUND*0.75);
    const tw = 0.3 + 0.4*Math.abs(Math.sin(frame*0.05+i));
    ctx.fillStyle = `rgba(220,220,255,${tw})`;
    ctx.beginPath(); ctx.arc(sx, sy, 0.9+(i%3)*0.5, 0, Math.PI*2); ctx.fill();
  }
  const pM = GW+80;
  const planets = [
    { ox:0.18, y:60,  r:22, col:'#a06bff', ring:true  },
    { ox:0.62, y:95,  r:13, col:'#ff7f7f', ring:false },
    { ox:0.85, y:45,  r:9,  col:'#7fd0ff', ring:false },
  ];
  planets.forEach(p => {
    const px = ((p.ox*GW - parMid*0.4) % pM + pM) % pM - 40;
    const gr = ctx.createRadialGradient(px-p.r*0.3, p.y-p.r*0.3, 1, px, p.y, p.r);
    gr.addColorStop(0, p.col+'ee'); gr.addColorStop(1, p.col+'33');
    if (p.ring) {
      ctx.strokeStyle = p.col+'88'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(px, p.y, p.r*1.7, p.r*0.5, -0.3, 0, Math.PI*2); ctx.stroke();
    }
    ctx.fillStyle = gr;
    ctx.beginPath(); ctx.arc(px, p.y, p.r, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath(); ctx.arc(px-p.r*0.3, p.y-p.r*0.3, p.r*0.35, 0, Math.PI*2); ctx.fill();
  });
}


function drawObs(o) {
  ctx.save();
  const pal = (MAP.obsPalette) || { wood:['#9e7a50','#5c3d1e'], line:'#3d2000', pattern:'wood' };
  const [cA, cB] = pal.wood;

  if (o.type === 'air') {
    // ── อุปสรรคลอย: รูปทรงต่างกันตามแมพ ──
    const cx = o.x + o.w / 2, cy = o.y + o.h / 2;
    const og = ctx.createRadialGradient(cx, cy, 2, cx, cy, o.w / 2);
    og.addColorStop(0, MAP.acc + 'ff'); og.addColorStop(0.5, MAP.acc + '99'); og.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = og;
    switch (pal.pattern) {
      case 'ice': // เกล็ดน้ำแข็งลอย
        ctx.save(); ctx.translate(cx, cy);
        for (let i = 0; i < 6; i++) {
          ctx.rotate(Math.PI / 3);
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -o.h / 2); ctx.strokeStyle = '#cdf3ff'; ctx.lineWidth = 2; ctx.stroke();
        }
        ctx.restore();
        ctx.beginPath(); ctx.ellipse(cx, cy, o.w / 2, o.h / 2, 0, 0, Math.PI * 2); ctx.fill();
        break;
      case 'rock': // ลูกไฟลอย
        ctx.beginPath(); ctx.ellipse(cx, cy, o.w / 2, o.h / 2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff3c0aa';
        ctx.beginPath(); ctx.ellipse(cx, cy - 2, o.w / 4, o.h / 4, 0, 0, Math.PI * 2); ctx.fill();
        break;
      case 'metal': // อุกกาบาตเล็ก
        ctx.beginPath(); ctx.ellipse(cx, cy, o.w / 2, o.h / 2, frame * 0.02, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.beginPath(); ctx.arc(cx - 3, cy - 2, 2.5, 0, Math.PI * 2); ctx.fill();
        break;
      case 'bark': // ใบไม้ร่วง
        ctx.beginPath(); ctx.ellipse(cx, cy, o.w / 2, o.h / 1.6, Math.sin(frame * 0.05), 0, Math.PI * 2); ctx.fill();
        break;
      case 'candy': // ลูกอมลอย
        ctx.beginPath(); ctx.ellipse(cx, cy, o.w / 2, o.h / 2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ffffffaa'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(cx, cy, o.w / 3, 0, Math.PI * 1.3); ctx.stroke();
        break;
      default: // bakery — เมฆแป้ง
        ctx.beginPath(); ctx.ellipse(cx, cy, o.w / 2, o.h / 2, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    return;
  }

  // ── อุปสรรคพื้น: ลายเฉพาะตามแมพ ──
  const wg = ctx.createLinearGradient(o.x, o.y, o.x + o.w, o.y + o.h);
  wg.addColorStop(0, cA); wg.addColorStop(1, cB);
  ctx.fillStyle = wg;
  rrectPath(ctx, o.x, o.y, o.w, o.h, 4); ctx.fill();
  ctx.strokeStyle = pal.line; ctx.lineWidth = 1.5; ctx.stroke();

  switch (pal.pattern) {
    case 'candy': // ขนมหวาน — ลายแถบทแยงสีชมพู/ขาว
      ctx.save(); rrectPath(ctx, o.x, o.y, o.w, o.h, 4); ctx.clip();
      ctx.strokeStyle = '#ffffffcc'; ctx.lineWidth = 6;
      for (let d = -o.h; d < o.w + o.h; d += 12) {
        ctx.beginPath(); ctx.moveTo(o.x + d, o.y + o.h); ctx.lineTo(o.x + d + o.h, o.y); ctx.stroke();
      }
      ctx.restore();
      break;
    case 'ice': // ไอศกรีม — เหลี่ยมน้ำแข็งระยิบระยับ
      ctx.save(); rrectPath(ctx, o.x, o.y, o.w, o.h, 4); ctx.clip();
      ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const fx = o.x + Math.random() * o.w, fy = o.y + Math.random() * o.h;
        ctx.beginPath(); ctx.moveTo(fx - 4, fy); ctx.lineTo(fx + 4, fy); ctx.moveTo(fx, fy - 4); ctx.lineTo(fx, fy + 4); ctx.stroke();
      }
      ctx.restore();
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(o.x + o.w * 0.4, o.y); ctx.lineTo(o.x, o.y + o.h); ctx.closePath(); ctx.fill();
      break;
    case 'bark': // ป่าคุกกี้ — ลายไม้/เปลือกไม้โค้ง
      ctx.save(); rrectPath(ctx, o.x, o.y, o.w, o.h, 4); ctx.clip();
      ctx.strokeStyle = 'rgba(20,10,0,0.35)'; ctx.lineWidth = 1.4;
      for (let r = o.y + 10; r < o.y + o.h; r += 11) {
        ctx.beginPath();
        ctx.moveTo(o.x, r);
        ctx.quadraticCurveTo(o.x + o.w / 2, r + 5, o.x + o.w, r);
        ctx.stroke();
      }
      ctx.restore();
      break;
    case 'rock': // ภูเขาไฟ — หินดำมีรอยแตกเรืองแสง
      ctx.save(); rrectPath(ctx, o.x, o.y, o.w, o.h, 4); ctx.clip();
      ctx.strokeStyle = '#ff5722'; ctx.lineWidth = 1.3; ctx.globalAlpha = 0.7 + 0.3 * Math.sin(frame * 0.15);
      ctx.beginPath();
      ctx.moveTo(o.x + o.w * 0.2, o.y); ctx.lineTo(o.x + o.w * 0.5, o.y + o.h * 0.4);
      ctx.lineTo(o.x + o.w * 0.3, o.y + o.h * 0.6); ctx.lineTo(o.x + o.w * 0.7, o.y + o.h);
      ctx.stroke();
      ctx.restore(); ctx.globalAlpha = 1;
      break;
    case 'metal': // อวกาศ — แผ่นโลหะมีหมุด
      ctx.save(); rrectPath(ctx, o.x, o.y, o.w, o.h, 4); ctx.clip();
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      for (let r = o.y + 8; r < o.y + o.h - 4; r += 14) {
        ctx.beginPath(); ctx.arc(o.x + 7, r, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(o.x + o.w - 7, r, 2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.strokeStyle = 'rgba(180,180,255,0.25)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(o.x, o.y + o.h * 0.5); ctx.lineTo(o.x + o.w, o.y + o.h * 0.5); ctx.stroke();
      ctx.restore();
      break;
    default: // bakery — ไม้แผ่นลายเส้นแนวนอน + เส้นกลาง
      for (let r = o.y + 13; r < o.y + o.h; r += 14) {
        ctx.strokeStyle = 'rgba(40,15,0,0.3)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(o.x, r); ctx.lineTo(o.x + o.w, r); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(o.x + o.w / 2, o.y); ctx.lineTo(o.x + o.w / 2, o.y + o.h); ctx.stroke();
  }
  ctx.restore();
}

// ── ลายเฉพาะของแต่ละแมพ ใช้ทั้งใน preview เล็กและ showcase ──
function drawMapMotif(c, id, W, H, accent) {
  const gY = H * 0.65;
  switch (id) {
    case 'bakery':
      c.fillStyle = accent + '33';
      c.beginPath(); c.ellipse(W * 0.3, gY - 9, 9, 7, 0, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.ellipse(W * 0.75, gY - 7, 7, 5, 0, 0, Math.PI * 2); c.fill();
      break;
    case 'candy':
      [0.25, 0.55, 0.82].forEach(fx => {
        c.strokeStyle = '#ffffff66'; c.lineWidth = 2;
        c.beginPath(); c.moveTo(W * fx, gY); c.lineTo(W * fx, gY - 14); c.stroke();
        c.fillStyle = '#ff8fc0'; c.beginPath(); c.arc(W * fx, gY - 14, 4.5, 0, Math.PI * 2); c.fill();
      });
      break;
    case 'icecream':
      c.fillStyle = 'rgba(255,255,255,0.3)';
      c.beginPath(); c.moveTo(W * 0.15, gY); c.lineTo(W * 0.27, gY - 16); c.lineTo(W * 0.39, gY); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(W * 0.55, gY); c.lineTo(W * 0.65, gY - 11); c.lineTo(W * 0.75, gY); c.closePath(); c.fill();
      break;
    case 'forest':
      [0.2, 0.45, 0.7, 0.9].forEach(fx => {
        c.fillStyle = 'rgba(60,160,50,0.45)';
        c.beginPath(); c.moveTo(W * fx, gY); c.lineTo(W * fx + 6, gY - 14); c.lineTo(W * fx + 12, gY); c.closePath(); c.fill();
      });
      break;
    case 'lava':
      c.fillStyle = 'rgba(0,0,0,0.4)';
      c.beginPath(); c.moveTo(W * 0.2, gY); c.lineTo(W * 0.32, gY - 17); c.lineTo(W * 0.44, gY); c.closePath(); c.fill();
      c.fillStyle = '#ff6a00aa';
      c.beginPath(); c.arc(W * 0.7, gY - 6, 3, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(W * 0.8, gY - 12, 2, 0, Math.PI * 2); c.fill();
      break;
    case 'space':
      c.fillStyle = '#a06bffcc';
      c.beginPath(); c.arc(W * 0.25, H * 0.25, 5, 0, Math.PI * 2); c.fill();
      c.strokeStyle = '#a06bff88'; c.lineWidth = 1.5;
      c.beginPath(); c.ellipse(W * 0.25, H * 0.25, 9, 3, -0.3, 0, Math.PI * 2); c.stroke();
      for (let i = 0; i < 8; i++) {
        c.fillStyle = 'rgba(255,255,255,0.5)';
        c.beginPath(); c.arc((i * 23 + 6) % W, (i * 11 + 4) % (H * 0.5), 0.8, 0, Math.PI * 2); c.fill();
      }
      break;
  }
}
