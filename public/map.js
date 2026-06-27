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
// ⭐ ตำแหน่งเยลลี่ตอนกระโดด (tile 102 / 105 / 106) ไม่ได้คำนวณ physics
//    แล้ว — กำหนดมือได้เลยที่ตัวแปร JELLY_LAYOUTS ด้านล่าง (เหมือนวาง CSS)
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
// JELLY_LAYOUTS — ตำแหน่งเยลลี่ตอนกระโดด (วางมือ ไม่คำนวณ physics)
// ══════════════════════════════════════════════════════════
// แต่ละ tile ที่มีกระโดด (102 / 105 / 106) จะมี array ของจุดเยลลี่
// ตำแหน่งแต่ละจุดอ้างอิงจาก "จุดยึดของ obstacle" ในแนวนอน-แนวตั้งเอง
// (เหมือนวาง CSS: บอกแค่ระยะห่าง ไม่ต้องคำนวณแรงโน้มถ่วง/ความเร็วกระโดด)
//
//   dx : ระยะห่างแนวนอนจากกึ่งกลาง obstacle (px) — ลบ = ก่อนถึง obs, บวก = เลยไปแล้ว
//   dy : ระยะห่างแนวตั้งจากพื้น (px) — ค่ายิ่งลบมาก = ยิ่งสูงขึ้นจากพื้น
//   r  : รัศมีเยลลี่ (px, ไม่ระบุ = ใช้ค่าเริ่มต้น 10)
//
// แก้ตัวเลขในนี้ได้เลยเพื่อจัดตำแหน่งเยลลี่ให้ตรงกับ jump arc จริงของเกม
// ══════════════════════════════════════════════════════════
const JELLY_LAYOUTS = {

  // ── 102: obs สั้น กระโดด 1 ครั้ง ──────────────────────
  102: [
    { dx: -90, dy: 40 },
    { dx: -60, dy: 70 },
    { dx: -30, dy: 85 },
    { dx:   0, dy: 85 },
    { dx:  30, dy: 70 },
    { dx:  60, dy: 40 },
  ],

  // ── 105: obs สูง กระโดด 2 ครั้ง (double jump) ─────────
  105: [
    { dx: -140, dy: 40  },
    { dx: -110, dy: 75  },
    { dx:  -80, dy: 105 },
    { dx:  -45, dy: 125 },
    { dx:  -10, dy: 130 },
    { dx:   25, dy: 125 },
    { dx:   60, dy: 105 },
    { dx:   90, dy: 75  },
    { dx:  120, dy: 40  },
  ],

  // ── 106: obs กว้าง กระโดดยาว 1 ครั้ง ───────────────────
  106: [
    { dx: -110, dy: 40 },
    { dx:  -75, dy: 65 },
    { dx:  -40, dy: 80 },
    { dx:    0, dy: 85 },
    { dx:   40, dy: 80 },
    { dx:   75, dy: 65 },
    { dx:  110, dy: 40 },
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

  // ค่า physics คงที่ (ต้องตรงกับ index.html) — ใช้แค่กำหนดความสูงพื้น/ตัวละคร
  const GROUND     = 310;
  const GW         = 800;
  const CH         = 48;
  const JELLY_GAP  = 32; // ระยะห่างเยลลี่บน trail

  // ── ต้องตรงกับ index.html: HP ลดเอง 1 หน่วยทุก 2 วิ (120 เฟรม @60fps) ──
  const HP_TICK_FRAMES = 120;
  const FALLBACK_HP    = 70;     // เผื่อไม่ได้ส่ง maxHp มา
  const SAFETY_MULT    = 3;      // สร้างแมพเผื่อไว้ 3 เท่าของระยะที่วิ่งได้แน่ๆ (เผื่อฮีล/สกิลต่อชีวิต)

  const hp = (typeof maxHp === 'number' && maxHp > 0) ? maxHp : FALLBACK_HP;
  const spd = (typeof mapSpeed === 'number' && mapSpeed > 0) ? mapSpeed : 5;

  // ระยะที่วิ่งได้แน่ๆ ถ้าไม่โดนอะไรเลย (เลือดลดเองเรื่อยๆ จนตาย)
  const guaranteedDistancePx = hp * HP_TICK_FRAMES * spd;
  // ระยะที่ต้องเตรียมแมพไว้ล่วงหน้า (เผื่อฮีล/สกิลต่อชีวิตทำให้วิ่งได้ไกลกว่านั้น)
  const requiredDistancePx = guaranteedDistancePx * SAFETY_MULT;

  // ความยาวของแมพที่เขียนไว้ 1 รอบ (px)
  const patternDistancePx = pattern.length * TILE_WIDTH;
  // ต้องวน pattern ซ้ำกี่รอบถึงจะยาวพอ (อย่างน้อย 1 รอบ)
  const repeatCount = Math.max(1, Math.ceil(requiredDistancePx / patternDistancePx));

  // ฟังก์ชันช่วยวางเยลลี่ตามตาราง JELLY_LAYOUTS (ไม่คำนวณ physics)
  // anchorWX = ตำแหน่งกึ่งกลางของ obstacle ในแถบนั้น
  function placeJellyLayout(plan, layoutCode, anchorWX) {
    const layout = JELLY_LAYOUTS[layoutCode] || [];
    for (const pt of layout) {
      const wx = anchorWX + pt.dx;
      const y = GROUND - CH / 2 - pt.dy; // dy บวก = สูงขึ้นจากพื้น
      const r = pt.r || 10;
      plan.push({ worldX: wx, kind: 'jel', y, r, bob: (wx % 8) * 0.4, val: 7, trail: true });
    }
  }

  // วนแปลง tile ทีละตัว — ทำซ้ำ pattern จนกว่าจะยาวพอรองรับเลือด x SAFETY_MULT
  let curWX = GW + 300; // เริ่ม spawn หลังจอแรก

  for (let rep = 0; rep < repeatCount; rep++) {
    for (let i = 0; i < pattern.length; i++) {
      const code = pattern[i];
      const tileStart = curWX;

      switch (code) {

      // ── 101 พื้นเรียบ ──────────────────────────────────
      case 101: {
        // เยลลี่บนพื้นตลอด tile
        for (let wx = tileStart + 20; wx < tileStart + TILE_WIDTH - 20; wx += JELLY_GAP) {
          plan.push({ worldX: wx, kind: 'jel', y: GROUND - CH / 2, r: 10, bob: (wx % 8) * 0.4, val: 7, trail: true });
        }
        break;
      }

      // ── 102 กระโดด 1 รอบ (obs สั้น + เยลลี่วางมือ) ──────
      case 102: {
        const obsWX = tileStart + TILE_WIDTH * 0.45;
        const ow = 28, oh = 44, oTop = GROUND - oh;
        plan.push({ worldX: obsWX, kind: 'obs', w: ow, h: oh, y: oTop, type: 'short' });

        placeJellyLayout(plan, 102, obsWX);
        break;
      }

      // ── 103 หลุม (pit) ──────────────────────────────────
      case 103: {
        // obs อากาศแบบ 'pit' ทำหน้าที่เป็นตัวกั้นแทน (ไม่มีพื้น)
        // ไม่มีเยลลี่ในช่วงนี้ เพื่อบังคับให้กระโดดข้าม
        const pitObsWX = tileStart + TILE_WIDTH * 0.5;
        plan.push({ worldX: pitObsWX, kind: 'obs', w: 80, h: 22, y: GROUND - 130, type: 'air' });
        break;
      }

      // ── 104 อุปสรรคอากาศ (ลอยกลางอากาศ วิ่งลอดได้) ────
      case 104: {
        const airWX = tileStart + TILE_WIDTH * 0.5;
        plan.push({ worldX: airWX, kind: 'obs', w: 36, h: 22, y: GROUND - 140, type: 'air' });

        // เยลลี่บนพื้นวิ่งผ่านได้ตลอด tile (เว้นใต้ obs)
        for (let wx = tileStart + 20; wx < tileStart + TILE_WIDTH - 20; wx += JELLY_GAP) {
          const underAir = wx > airWX - 20 && wx < airWX + 56;
          if (!underAir) {
            plan.push({ worldX: wx, kind: 'jel', y: GROUND - CH / 2, r: 10, bob: (wx % 8) * 0.4, val: 7, trail: true });
          }
        }
        break;
      }

      // ── 105 อุปสรรคสูง (tall + กระโดด 2 รอบ + เยลลี่วางมือ) ──
      case 105: {
        const tallWX = tileStart + TILE_WIDTH * 0.45;
        const tw = 28, th = 80, tTop = GROUND - th;
        plan.push({ worldX: tallWX, kind: 'obs', w: tw, h: th, y: tTop, type: 'tall' });

        placeJellyLayout(plan, 105, tallWX);
        break;
      }

      // ── 106 อุปสรรคกว้าง (wide + กระโดดยาว + เยลลี่วางมือ) ──
      case 106: {
        const wideWX = tileStart + TILE_WIDTH * 0.4;
        const ww = 65, wh = 28, wTop = GROUND - wh;
        plan.push({ worldX: wideWX, kind: 'obs', w: ww, h: wh, y: wTop, type: 'wide' });

        placeJellyLayout(plan, 106, wideWX);
        break;
      }

      // ── 107 เยลลี่พิเศษ (โบนัสลอยกลางอากาศ) ───────────
      case 107: {
        // เยลลี่ปกติบนพื้นก่อน
        for (let wx = tileStart + 20; wx < tileStart + TILE_WIDTH - 20; wx += JELLY_GAP * 1.5) {
          plan.push({ worldX: wx, kind: 'jel', y: GROUND - CH / 2, r: 10, bob: (wx % 8) * 0.4, val: 7, trail: true });
        }
        // เยลลี่พิเศษ 3 ลูกลอยกลาง tile
        const bonusY = GROUND - 100;
        for (let b = 0; b < 3; b++) {
          const bwx = tileStart + TILE_WIDTH * (0.3 + b * 0.2);
          plan.push({ worldX: bwx, kind: 'jel', y: bonusY, r: 13, bob: b * 0.8, val: 15, trail: false, special: true });
        }
        break;
      }

      default: {
        // รหัสที่ไม่รู้จัก → ปฏิบัติเหมือน 101
        for (let wx = tileStart + 20; wx < tileStart + TILE_WIDTH - 20; wx += JELLY_GAP) {
          plan.push({ worldX: wx, kind: 'jel', y: GROUND - CH / 2, r: 10, bob: (wx % 8) * 0.4, val: 7, trail: true });
        }
      }
      } // switch

      curWX += TILE_WIDTH;
    } // for tile
  } // for rep

  plan.sort((a, b) => a.worldX - b.worldX);
  return plan;
}
