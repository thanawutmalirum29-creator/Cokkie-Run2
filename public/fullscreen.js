// ══════════════════════════════════════════════════════════
// fullscreen.js — ขอ fullscreen + ล็อกแนวนอน (landscape)
// ══════════════════════════════════════════════════════════

function isCurrentlyFullscreen() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement);
}

function requestFs(el) {
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
