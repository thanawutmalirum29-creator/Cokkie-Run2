// ══════════════════════════════════════════════════════════
// gameData.js — ข้อมูลร่วมระหว่าง lobby และ game
// ══════════════════════════════════════════════════════════

const CHARS = [
  { id:'choco',      name:'ช็อกโกแลต',    desc:'ธรรมดา สมดุล  ❤×70',
    bodyColor:['#3d1a00','#6b3310','#c47430'], chipColor:'#1a0500', eyeColor:'#fff8e1',
    bonus:null,         maxHp:70 },
  { id:'strawberry', name:'สตรอว์เบอร์รี่', desc:'ผลิตเยลลี่หมีพิเศษ  ❤×55',
    bodyColor:['#7a0020','#c0392b','#e87070'], chipColor:'#3d0010', eyeColor:'#ffe0e0',
    bonus:'yellowJelly', maxHp:55 },
  { id:'matcha',     name:'มัทฉะ',          desc:'พุ่งเร็ว + อมตะ  ❤×55',
    bodyColor:['#1a3d00','#3d7a10','#7abf30'], chipColor:'#0a2000', eyeColor:'#e8ffe0',
    bonus:'dash',        maxHp:55 },
  { id:'vanilla',    name:'วนิลา',          desc:'เยลลี่ +5 แต้ม  ❤×65',
    bodyColor:['#6b5a00','#c9a84c','#fce4a0'], chipColor:'#3d3000', eyeColor:'#fffde0',
    bonus:'jellyBonus',  maxHp:65 },
  { id:'blueberry',  name:'บลูเบอร์รี่',   desc:'ผลิตยาฮีล  ❤×50',
    bodyColor:['#0d1a4d','#2a47a8','#6080e0'], chipColor:'#050a2a', eyeColor:'#e0e8ff',
    bonus:'healPotion',  maxHp:50 },
  { id:'ghost',      name:'คุกกี้ผี',      desc:'⭐ ฟื้นคืนชีพ  ❤×88',
    bodyColor:['#2a2a3a','#5a5a7a','#c0c0e0'], chipColor:'#111122', eyeColor:'#e0e0ff',
    bonus:'revive',      maxHp:88 },
];

const MAPS = [
  { id:'bakery',   name:'เบเกอรี่',   tag:'แมพเริ่มต้น',
    sky:['#0d0200','#2a0d00','#5c2000'], ground:['#7a3a10','#4a1f05'], accent:'#ff6b35',
    speed:5, obsInterval:95 },
  { id:'candy',    name:'แลนด์ขนม',  tag:'หวานหวาน',
    sky:['#200030','#4a0060','#8000a0'], ground:['#7a1060','#3d0030'], accent:'#ff80ab',
    speed:6, obsInterval:85 },
  { id:'icecream', name:'ไอศกรีม',   tag:'เย็นชื่น',
    sky:['#001a40','#002a70','#0040a0'], ground:['#104060','#062030'], accent:'#40c0ff',
    speed:7, obsInterval:78 },
  { id:'forest',   name:'ป่าคุกกี้', tag:'ธรรมชาติ',
    sky:['#001a00','#003000','#005000'], ground:['#1a4010','#0a2005'], accent:'#66cc44',
    speed:8, obsInterval:70 },
  { id:'lava',     name:'ภูเขาไฟ',   tag:'🔥 ยากสุด',
    sky:['#200000','#400000','#700000'], ground:['#6b1a00','#3d0800'], accent:'#ff2200',
    speed:10, obsInterval:60 },
  { id:'space',    name:'อวกาศ',     tag:'สุดลึกลับ',
    sky:['#000005','#050010','#0a0020'], ground:['#1a1a40','#0a0a20'], accent:'#8060ff',
    speed:9, obsInterval:65 },
];

// ค่าสำรอง (ใช้ตอนยังโหลด /api/skills ไม่เสร็จ หรือเซิฟเวอร์เรียกไม่ติด)
// — ค่าจริงที่ใช้เล่นจะมาจากเซิฟเวอร์เสมอเมื่อโหลดสำเร็จ
const SKILLS_FALLBACK = {
  yellowJelly: { cooldownSec: 5,  jellyScore: 15 },
  revive:      { reviveHp: 20, hpPerJellies: 1, jelliesPerBonus: 10 },
  dash:        { cooldownSec: 15, durationSec: 4, speedMult: 1.8 },
  jellyBonus:  { bonus: 5 },
  healPotion:  { cooldownSec: 25, healAmount: 3 },
};

// โหลดข้อมูลสกิลจากเซิฟเวอร์ (ตัวเลขจริงไม่ได้อยู่ในไฟล์นี้)
async function fetchSkills() {
  try {
    const res = await fetch('/api/skills');
    if (!res.ok) throw new Error('bad status');
    return await res.json();
  } catch (e) {
    console.warn('โหลดข้อมูลสกิลจากเซิฟเวอร์ไม่สำเร็จ ใช้ค่าสำรองแทน', e);
    return SKILLS_FALLBACK;
  }
}

function bonusDesc(b, maxHp, skills) {
  const s = (skills || SKILLS_FALLBACK)[b] || SKILLS_FALLBACK[b] || {};
  const base = ({
    yellowJelly: `ความสามารถพิเศษ: ผลิตเยลลี่หมีเหลืองด้านหน้าทุก ${s.cooldownSec} วิ (ให้ ${s.jellyScore} แต้ม)!`,
    revive:      `ความสามารถพิเศษ: ตายแล้วฟื้นคืนชีพ! เลือด ${s.reviveHp} หน่วย (+${s.hpPerJellies} ต่อ ${s.jelliesPerBonus} เยลลี่ที่เก็บได้)`,
    dash:        `ความสามารถพิเศษ: พุ่งไปข้างหน้า + อมตะ ${s.durationSec} วิ ทุกๆ ${s.cooldownSec} วิ!`,
    jellyBonus:  `ความสามารถพิเศษ: เก็บเยลลี่ได้คะแนนเพิ่ม +${s.bonus} แต้มต่อลูก!`,
    healPotion:  `ความสามารถพิเศษ: ผลิตน้ำยาฮีลทุก ${s.cooldownSec} วิ (ฮีล ${s.healAmount} หน่วย)`,
  })[b] || '';
  return base + (maxHp ? `  |  ❤ ${maxHp} หน่วย` : '');
}
