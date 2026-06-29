// ══════════════════════════════════════════════════════════
// spa-nav.js — เปลี่ยนหน้าแบบไม่ reload จริง (กันจอขาว/แถบโหลดบน
// Android Chrome ที่ติดตั้งเป็นแอปแล้ว) โดย fetch หน้าใหม่มาสลับ DOM
// แทนการ navigate จริงทั้งหมด
// ══════════════════════════════════════════════════════════
(function(){
  if(window.__crNavInit) return;
  window.__crNavInit = true;

  // เก็บ src ของสคริปต์ที่โหลดไปแล้ว กันโหลดซ้ำ/ประกาศตัวแปรซ้ำ
  window.__crLoadedScripts = window.__crLoadedScripts || new Set();
  Array.prototype.forEach.call(document.querySelectorAll('script[src]'), function(s){
    try{ window.__crLoadedScripts.add(new URL(s.src, location.href).href); }catch(e){}
  });

  function runScriptsInOrder(scripts, i, done){
    if(i>=scripts.length){ done(); return; }
    var old = scripts[i];
    if(old.src){
      var abs;
      try{ abs = new URL(old.src, location.href).href; }catch(e){ abs = old.src; }
      if(window.__crLoadedScripts.has(abs)){ runScriptsInOrder(scripts,i+1,done); return; }
      var s = document.createElement('script');
      s.src = old.src;
      s.onload = function(){ window.__crLoadedScripts.add(abs); runScriptsInOrder(scripts,i+1,done); };
      s.onerror = function(){ runScriptsInOrder(scripts,i+1,done); };
      document.body.appendChild(s);
    } else if(old.getAttribute('type')==='text/plain'){
      var holder = document.createElement('script');
      holder.type = 'text/plain';
      if(old.id) holder.id = old.id;
      holder.textContent = old.textContent;
      document.body.appendChild(holder);
      runScriptsInOrder(scripts,i+1,done);
    } else {
      try{ (new Function(old.textContent))(); }catch(e){ console.error('spa-nav script error:', e); }
      runScriptsInOrder(scripts,i+1,done);
    }
  }

  function crNavigate(url, isReplace, afterNav){
    fetch(url, {cache:'no-store'}).then(function(r){
      if(!r.ok) throw new Error('bad status '+r.status);
      return r.text();
    }).then(function(html){
      var doc = new DOMParser().parseFromString(html, 'text/html');
      document.title = doc.title;
      document.body.setAttribute('class', doc.body.getAttribute('class')||'');
      if(isReplace) history.replaceState({crUrl:url}, '', url);
      else history.pushState({crUrl:url}, '', url);
      // สลับ <style> ใน <head> ตามหน้าใหม่ด้วย เพราะแต่ละหน้ามี CSS ของตัวเอง
      Array.prototype.slice.call(document.head.querySelectorAll('style')).forEach(function(el){ el.remove(); });
      Array.prototype.slice.call(doc.head.querySelectorAll('style')).forEach(function(el){ document.head.appendChild(el.cloneNode(true)); });
      document.body.innerHTML = doc.body.innerHTML;
      var scripts = Array.prototype.slice.call(doc.body.querySelectorAll('script'));
      runScriptsInOrder(scripts, 0, function(){
        window.scrollTo(0,0);
        if(typeof afterNav === 'function') afterNav();
      });
    }).catch(function(err){
      console.warn('spa-nav fallback to full navigation:', err);
      location.href = url;
    });
  }

  window.crNavigate = crNavigate;

  // บน Android กดปุ่ม Back จะ exit fullscreen ก่อน แล้วค่อย fire popstate
  // หลังสลับหน้าแล้วให้ขอ fullscreen กลับคืนทันที (ถ้าฟังก์ชันพร้อมใช้)
  window.addEventListener('popstate', function(){
    crNavigate(location.pathname + location.search, true, function(){
      if(typeof goFullscreenLandscape === 'function') goFullscreenLandscape();
    });
  });
})();
