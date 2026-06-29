// ══════════════════════════════════════════════════════════
// fullscreen.js — ขอ fullscreen + ล็อกแนวนอน (landscape)
// ══════════════════════════════════════════════════════════

function isCurrentlyFullscreen() {
  // ตรวจสอบทั้ง Fullscreen API จริง และ PWA display-mode: fullscreen/standalone
  // (PWA ที่ manifest ตั้ง "display": "fullscreen" จะไม่มี fullscreenElement
  //  แต่จอมันเต็มอยู่แล้ว ไม่ต้องแสดงปุ่ม)
  if (document.fullscreenElement || document.webkitFullscreenElement) return true;
  if (window.matchMedia && (
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: standalone)').matches
  )) return true;
  return false;
}

function requestFs(el) {
  // ถ้าเป็น PWA display-mode อยู่แล้ว ไม่ต้องขอ fullscreen ซ้ำ
  if (window.matchMedia && (
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: standalone)').matches
  )) return Promise.resolve();
  const target = el || document.documentElement;
  if (target.requestFullscreen) return target.requestFullscreen();
  if (target.webkitRequestFullscreen) return target.webkitRequestFullscreen();
  return Promise.resolve();
}

function lockLandscape() {
  if (screen.orientation && screen.orientation.lock) {
    return screen.orientation.lock('landscape').catch(() => {});
  }
  return Promise.resolve();
}

// ขอ fullscreen แบบเงียบ ไม่ throw ถ้าเบราว์เซอร์ไม่รองรับ/ผู้ใช้ยังไม่ tap
function goFullscreenLandscape(callback) {
  Promise.resolve(requestFs())
    .catch(() => {})
    .then(() => lockLandscape())
    .catch(() => {})
    .finally(() => {
      updateFsBtn();
      if (typeof callback === 'function') callback();
    });
}

// แสดง/ซ่อนปุ่ม fullscreen มุมขวาล่าง ตามสถานะปัจจุบัน
function updateFsBtn() {
  const btn = document.getElementById('fsBtn');
  if (!btn) return;
  btn.style.display = isCurrentlyFullscreen() ? 'none' : 'flex';
}

document.addEventListener('fullscreenchange', updateFsBtn);
document.addEventListener('webkitfullscreenchange', updateFsBtn);
